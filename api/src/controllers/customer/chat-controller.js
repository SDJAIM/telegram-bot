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
    res.status(500).send({ message: 'Error al obtener el chat' })
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
