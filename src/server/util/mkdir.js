const fs = require("fs")

async function mkdir(path) {
  if (!fs.existsSync(path)) {
    try {
      await fs.promises.mkdir(path, { recursive: true })
      console.log("Created %s", path)
      return { status: "OK", error: null }
    } catch (error) {
      return { status: "FAILED", error }
    }
  }
  return { status: "OK", error: null }
}

module.exports = mkdir
module.exports.mkdir = mkdir
