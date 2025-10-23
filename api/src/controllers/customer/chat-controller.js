const mongooseDb = require('../../models/mongoose')
const Chat = mongooseDb.Chat
const OpenAIService = require('../../services/openai-service')

exports.getChat = async (req, res) => {
  try {
    const threadId = req.params.threadId
    const chat = await Chat.findOne({ threadId })
      .lean()
      .exec()

    if (chat) {
      const response = chat.messages.map(message => {
        return {
          role: message.role,
          content: message.content[0].text.value
        }
      })
      res.status(200).send(response)
    } else {
      res.status(404).send({ message: 'Chat no encontrado' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Error al obtener el chat' })
  }
}

exports.assistantResponse = async (req, res) => {
  try {
    const openai = new OpenAIService()
    const prompt = req.body.prompt
    let escalateToHuman = false

    if (req.body.threadId) {
      await openai.setThread(req.body.threadId)
    } else {
      await openai.createThread()
    }

    await openai.setAssistant(process.env.OPENAI_ASSISTANT_CHATBOT_ID)
    await openai.createMessage(prompt)
    await openai.runStatus()

    if (openai.tools) {
      const toolsOutputs = []

      for (const tool of openai.tools) {
        const data = JSON.parse(tool.function.arguments)

        if (tool.function.name === 'escalate_to_human_due_to_user_behavior') {
          this.escalateToHumanUserBehavior(req, data.conversationContext, openai.threadId)
          escalateToHuman = true

          toolsOutputs.push({
            tool_call_id: tool.id,
            output: 'Un humano se va a incorporar a la conversación para resolver la consulta del usuario.'
          })
        }

        if (tool.function.name === 'escalate_to_human_no_answer') {
          this.escalateToHumanNoAnswer(req, data.conversationContext, openai.threadId)
          escalateToHuman = true

          toolsOutputs.push({
            tool_call_id: tool.id,
            output: 'Un humano se va a incorporar a la conversación para resolver la consulta del usuario.'
          })
        }

        if (tool.function.name === 'search_product') {
          const response = await this.searchProduct(data.userQuestion)

          toolsOutputs.push({
            tool_call_id: tool.id,
            output: JSON.stringify(response)
          })
        }
        // Add fallback for unrecognized tools
        else {
          toolsOutputs.push({
            tool_call_id: tool.id,
            output: 'Tool not recognized'
          })
        }
      }

      await openai.submitToolOutputs(toolsOutputs)
    }

    const chat = await Chat.findOne({ threadId: openai.threadId })

    if (chat) {
      chat.messages = openai.messages
      chat.run = openai.run
      chat.markModified('messages')
      chat.markModified('run')
      await chat.save()
    } else {
      await Chat.create({
        assistantEndpoint: process.env.OPENAI_ASSISTANT_CHATBOT_ID,
        threadId: openai.threadId,
        run: openai.run,
        messages: openai.messages,
        deletedAt: null
      })
    }

    let answer = openai.answer
    try { answer = JSON.parse(openai.answer) } catch (_) {}

    const response = {
      threadId: openai.threadId,
      escalateToHuman,
      answer
    }

    res.status(200).send(response)
  } catch (error) {
    console.error('Chat controller error:', error)
    res.status(500).send({
      message: 'Error processing chat request',
      error: error.message
    })
  }
}

exports.relayUserMessage = async (req, res) => {
  try {
    const { message, threadId } = req.body
    req.telegramService.relayUserMessage(threadId, message)
    res.status(200).send({ message: 'Mensaje enviado al humano' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Error al enviar el mensaje al humano' })
  }
}

exports.escalateToHumanUserBehavior = (req, conversationContext, threadId) => {
  req.telegramService.escalateToHuman(threadId, conversationContext)
}

exports.escalateToHumanNoAnswer = (req, conversationContext, threadId) => {
  req.telegramService.escalateToHuman(threadId, conversationContext)
}

// Funci�n para b�squeda de productos desde el chat
exports.searchProduct = async (searchText) => {
  try {
    const { ChromaClient } = require('chromadb')
    const client = new ChromaClient({
      host: 'localhost',
      port: 8000,
      ssl: false
    })

    console.log(' B�squeda desde chat:', searchText)

    // Validar longitud m�nima
    if (!searchText || searchText.length < 5) {
      return { error: 'La b�squeda requiere al menos 5 caracteres' }
    }

    const collection = await client.getCollection({ name: 'products' })
    const results = await collection.query({
      queryTexts: [searchText],
      nResults: 3
    })

    // Formatear resultados
    const products = results.ids[0].map((id, index) => ({
      id,
      name: results.metadatas[0][index].name,
      score: results.distances[0][index]
    }))

    console.log(' Productos encontrados desde chat:', products.length)
    return { results: products }
  } catch (error) {
    console.error(' Error en searchProduct:', error)
    return { error: 'Error en la b�squeda de productos' }
  }
}
