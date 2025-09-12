import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const chat = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const completion = await openai.chat.completions.create({
      messages: [{
        role: 'user',
        content: message
      }],
      model: 'gpt-3.5-turbo',
      max_tokens: 150
    })

    res.json({
      response: completion.choices[0]?.message?.content
    })
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    res.status(500).json({ error: 'Error processing your request' })
  }
}
