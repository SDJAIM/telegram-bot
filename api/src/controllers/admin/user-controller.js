exports.create = async (req, res) => {
  console.log(req.body)
  res.send('POST request to the homepage')
}

exports.findAll = async (req, res) => {
  console.log(req.userLanguage)
  res.send('GET request to the homepage')
}

exports.findOne = async (req, res) => {
  console.log(req.params.id)
  res.send('GET request to the homepage')
}

exports.update = async (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  res.send('PUT request to the homepage')
}

exports.delete = async (req, res) => {
  console.log(req.params.id)
  res.send('DELETE request to the homepage')
}
