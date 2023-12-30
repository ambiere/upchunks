module.exports = function routeNotFound (req, res) {
  res.status(404).send({
    message: `Route ${req.method}:${req.url} not found`,
    error: 'Not Found',
    statusCode: 404
  })
}
