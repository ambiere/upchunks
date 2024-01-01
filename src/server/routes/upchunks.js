const { Router } = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const Collection = require("../services/collection")
const MongoDbClient = require("../services/mongodb")
const handleFileChunks = require("../util/handleFileChunks")

const router = Router({ strict: true })
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/file", upload.single("file"), async function (req, res, next) {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded :)")
      error.code = "ENOFUP"
      throw error
    }
    const buffer = req.file.buffer
    const filename = req.file.originalname
    const mimetype = req.file.mimetype
    const chunks = Number(req.body.chunks)
    const chunk = Number(req.body.chunk)
    const filesDir = path.join(__dirname, "../..", "files")
    const filePath = filesDir + `/${filename}`

    !fs.existsSync(filesDir) && fs.mkdirSync(filesDir)
    if (chunks && chunk) {
      const filename = req.body.originalname
      const filePath = filesDir + `/${filename}`
      const fileSize = Number(req.body.fileSize)
      const { mergedFileSize, error } = await handleFileChunks({ filename, buffer, chunk, chunks, filesDir })
      if (error) return next(error)
      req.log.error(mergedFileSize, "merged filesize")
      if (mergedFileSize === fileSize) {
        const filedata = {
          originalname: filename,
          mimetype: mimetype,
          size: fileSize,
          filePath: filePath,
        }
        const insertedId = await Collection.insertDocument("upchunks", filedata)
        return res.json({ fileId: insertedId, ...filedata })
      }
      return res.json({ message: `chunk ${chunk}/${chunks} saved`, status: "OK" })
    }
    await fs.promises.writeFile(filePath, buffer)
    const filedata = {
      originalname: filename,
      mimetype: mimetype,
      fileSize: req.file.size,
      filePath: filePath,
    }
    const insertedId = await Collection.insertDocument("upchunks", filedata)
    res.json({ fileId: insertedId, ...filedata })
  } catch (error) {
    next(error)
  }
})

router.get("/file/download/:fileId", async function (req, res, next) {
  try {
    const { _id, err } = MongoDbClient.generateObjectId(req.params.fileId)
    if (err) return next(err)
    const filedata = await Collection.getDocument("upchunks", { _id })
    if (!filedata) {
      const error = new Error("File not found :)")
      error.code = "ENOENT"
      throw error
    }
    const filePath = filedata.filePath
    await fs.promises.access(filePath)
    res.setHeader("Content-Disposition", `attachment; filename=${path.basename(filePath)}`)
    res.setHeader("Content-Type", filedata.mimetype)
    fs.createReadStream(filePath).pipe(res)
  } catch (error) {
    next(error)
  }
})

module.exports = router
