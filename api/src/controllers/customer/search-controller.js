const { buscarProductos } = require('../../services/search-service')

async function find (req, res) {
  try {
    const query = req.query.query || ''
    if (!query.trim()) return res.json([])

    const results = await buscarProductos(query, 10)

    const ordenados = results.sort((a, b) => a.distancia - b.distancia)
    const top3 = ordenados.slice(0, 3)

    res.json(top3)
  } catch (error) {
    console.error('❌ Error en búsqueda:', error)
    res.status(500).json({ error: 'Error al buscar productos' })
  }
}

module.exports = { find }
