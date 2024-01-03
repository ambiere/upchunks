const fs = require("fs")
const path = require("path")
const mergeParts = require("./mergeParts")
const mkdir = require("./mkdir")

async function handleFileChunks({ filename, buffer, chunk, chunks, filesDir }) {
  const filePath = filesDir + `/${filename}`
  const chunksDir = path.join(__dirname, "../..", "chunks")

  try {
    const { error: err } = await mkdir(chunksDir)
    if (err) return { error: err }
    await fs.promises.writeFile(`${chunksDir}/${filename}.part_${chunk}`, buffer)
    if (chunk === chunks) {
      const { error } = await mergeParts({ filename, filePath, chunksDir, chunks })
      if (error) throw error
      return { mergedFileSize: fs.statSync(filePath).size }
    }
    return { mergedFileSize: 0, error: null }
  } catch (error) {
    const err = new Error(error)
    err.code = "EMEUCF"
    return { error: err }
  }
}

module.exports = handleFileChunks
module.exports.handleFileChunks = handleFileChunks
