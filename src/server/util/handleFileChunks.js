const fs = require("fs")
const path = require("path")
const mergeParts = require("./mergeParts")
const mkdir = require("./mkdir")

async function handleFileChunks({ filename, buffer, chunk, chunks, filesDir }) {
  const filePath = filesDir + `/${filename}`
  const chunksDir = path.join(__dirname, "../../..", "storage/chunks")
  try {
    const { error: mkdirErr } = await mkdir(chunksDir)
    if (mkdirErr) throw mkdirErr
    await fs.promises.writeFile(`${chunksDir}/${filename}.part_${chunk}`, buffer)
    if (chunk === chunks) {
      const { error: MergeErr, status: mergeStatus } = await mergeParts({ filename, filePath, chunksDir, chunks })
      if (MergeErr) throw MergeErr
      else if (mergeStatus === "done") {
        fs.access(filePath, (err) => {
          if (err) throw err
        })
        return { mergedFileSize: fs.statSync(filePath).size }
      }
    }
  } catch (error) {
    return { error: error }
  }
}

module.exports = handleFileChunks
module.exports.handleFileChunks = handleFileChunks
