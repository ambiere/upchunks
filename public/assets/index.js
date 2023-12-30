document.addEventListener("DOMContentLoaded", (e) => {
  const endpoints = document.querySelector("#endpoints")
  const formElem = document.querySelector("form")
  const uploadBtn = document.querySelector(".upload-btn")
  const fileInput = formElem.querySelector("#upload-input")
  const label = formElem.querySelector("#input-label")

  fileInput.parentElement.addEventListener("click", (e) => {
    fileInput.click()
  })

  fileInput.addEventListener("change", (e) => {
    if (fileInput.files[0]) {
      uploadBtn.disabled = false
      let name = fileInput.files[0].name.trim()
      if (name.length > 26) {
        name = name.replace(name.slice(12, name.length - 26), "....")
      }
      label.innerHTML = `<label for="upload-input">${name}</label>`
      label.innerHTML += `<button>x</button>`
      label.classList.add("file-selected")
      const btn = label.querySelector("button")
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        label.innerHTML = `<label for="upload-input">Browse file</label>`
        label.classList.remove("file-selected")
        uploadBtn.disabled = true
        formElem.reset()
      })
      return
    }
  })

  if (endpoints) {
    window
      .fetch("version")
      .then((res) => res.json())
      .then((version) => {
        endpoints.innerHTML = `   
            <p><span>POST /${getEndpointSegment(version)}/upchunks/file</span></p>
            <p><span>GET /${getEndpointSegment(version)}/upchunks/file/download/:fileId</span></p>
            <p><span>...</span></p>`
      })

    function getEndpointSegment(obj) {
      if (obj.version !== undefined) {
        return `v${obj.version}/api`
      }
    }
  }

  uploadBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const chunksSize = 1024 * 1024
    const fileInput = formElem.querySelector("#upload-input")
    const file = fileInput.files[0]
    const fileSize = file.size
    const chunks = Math.ceil(fileSize / chunksSize)
    const progress = 100 / chunks

    let chunk = 1
    let start = 0
    let end = chunksSize

    const uploadChunk = async () => {
      if (chunk <= chunks) {
        const chunkData = file.slice(start, end)
        const formData = new FormData()
        formData.append("file", chunkData)
        formData.append("chunk", chunk)
        formData.append("chunks", chunks)
        formData.append("originalname", file.name)
        formData.append("fileSize", fileSize)
        fetch("http://0.0.0.0:3000/v0/api/upchunks/file", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            formElem.reset()
            chunk === chunks && (label.innerHTML = `<label for="upload-input">Browse file</label>`)
            chunk === chunks && label.classList.remove("file-selected")
            if (chunk === chunks && data.fileId)
              document.querySelector(
                ".download-btn"
              ).href = `https://upchunks.fly.dev/v0/api/upchunks/file/download/${data.fileId}`
            uploadBtn.disabled = true
            console.log(data)
            const temp = `chunk ${chunk}/${chunks} uploaded successfully`
            chunk++
            start = end
            end += chunksSize
            console.log(temp)
            uploadChunk()
          })
          .catch((error) => {
            console.error("error uploading chunk:", error)
          })
      }
    }
    if (file) uploadChunk()
  })
})
