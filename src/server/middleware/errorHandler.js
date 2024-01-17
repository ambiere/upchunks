const { MongoServerError } = require("mongodb")
module.exports = function errorHandler(error, req, res, next) {
  const isENOENT = error.code === "ENOENT"
  const isENOFUP = error.code === "ENOFUP"
  const isEMECFA = error.code === "EMEUCF"
  const isMongoENOTFOUND = error.code === "ENOTFOUND"

  isENOENT && ErrorUtil.handleENOENT(error, res)
  isENOFUP && ErrorUtil.handleENOFUP(error, res)
  isEMECFA && ErrorUtil.handleInternalError(error, res, req)
  isMongoENOTFOUND && ErrorUtil.handleInternalError(error, res, req)
  error.statusCode >= 500 && ErrorUtil.handleInternalError(error, res, req)
  next(error)
}

const ErrorUtil = {
  handleENOENT: (error, res) => {
    res.status(404).json({ error: error.message, code: error.code, statusCode: 404 })
  },

  handleENOFUP: (error, res) => {
    res.status(400).json({ error: error.message, code: error.code, statusCode: 400 })
  },

  handleInternalError: (error, res, req) => {
    req.log.info(error)
    res.status(500).json({
      info: `Internal server error. Contact the support team. Id ${req.id}`,
      error: error.message,
      code: error.code,
      statusCode: 500,
    })
  },
}
