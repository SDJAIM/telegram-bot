import OpenAI from 'openai'
import dotenv from 'dotenv'
import { ChromaClient } from 'chromadb'
import fsp from 'fs/promises'
import path from 'path'

dotenv.config()

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Initialize ChromaDB
const chromaClient = new ChromaClient()
let productsCollection

// Product Ingestion Function
async function initializeChromaDB () {
  try {
    productsCollection = await chromaClient.getOrCreateCollection({
      name: 'products'
    })

    const baseDir = path.resolve('./data/copy')
    const entries = await fsp.readdir(baseDir, { withFileTypes: true })

    const items = []

    for (const entry of entries) {
      const file = entry.name
      const jsonPath = path.join(baseDir, file)
      const raw = await fsp.readFile(jsonPath, 'utf-8')
      const data = JSON.parse(raw)

      const id = file.split('_')[0]

      const document = await openai.completions.create({
        model: 'text-embedding-ada-002',
        prompt: data.newDescription,
        max_tokens: 500
      })

      const metadata = {
        filename: file,
        name: data.name || '',
        brand: data.brand || '',
        url: data.url || '',
        text: data.newDescription || ''
      }

      items.push({
        id,
        document: document.choices[0].text,
        metadata
      })
    }

    const products = items.reduce((acc, item) => {
      acc.ids = acc.ids || []
      acc.documents = acc.documents || []
      acc.metadatas = acc.metadatas || []

      acc.ids.push(item.id)
      acc.documents.push(item.document)
      acc.metadatas.push(item.metadata)

      return acc
    }, {})

    await productsCollection.add(products)
    console.log('✅ ChromaDB initialized successfully')
  } catch (err) {
    console.error('❌ ChromaDB initialization error:', err.message)
  }
}

// Product Query Function
async function queryProducts (queryText) {
  try {
    if (!productsCollection) {
      console.log('Products collection not initialized')
      return []
    }

    const results = await productsCollection.query({
      queryTexts: [queryText],
      nResults: 5
    })

    return results.metadatas[0].map(result => result)
  } catch (err) {
    console.error('Product query error:', err)
    return []
  }
}

export const chat = async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // First get ChromaDB results
    const products = await queryProducts(message)

    // Create context from product results
    const productContext = products.map(p =>
      `${p.name}: ${p.text} (${p.url})`
    ).join('\n')

    // Get OpenAI completion
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You're a helpful assistant. Relevant products:\n${productContext}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: 'gpt-3.5-turbo',
      max_tokens: 100
    })

    res.json({
      products,
      response: completion.choices[0]?.message?.content
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Error processing your request' })
  }
}

// Initialize on server start
initializeChromaDB()
