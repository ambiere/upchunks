require("dotenv").config();
const crypto = require("node:crypto");

module.exports = {
  quietReqLogger: true,
  useLevel: process.env.LOG_LEVEL || "warn",
  transport: {
    target: "pino-pretty",
    options: {
      destination: 1,
      all: true,
      translateTime: true,
    },
  },
  timestamp: () => {
    return `,"@timestamp": "${new Date(Date.now()).toDateString()}"`;
  },
  genReqId(req) {
    return req.headers["x-request-id"] || crypto.randomUUID();
  },
  serializers: {
    req: function (request) {
      return {
        method: request.method,
        url: request.url,
        version: request.headers?.["accept-version"],
        user: request.user?.id,
        headers: request.headers,
        hostname: request.hostname,
        remoteAddress: request.ip,
        remotePort: request.socket?.remotePort,
      };
    },
    res: function (response) {
      return {
        statusCode: response.statusCode,
      };
    },
  },
};
