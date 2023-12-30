const t = require("tap");
const path = require("path");
const fs = require("fs");
const handleFileChunks = require("../../src/server/util/handleFileChunks");

t.test("should merge chunks", async (t) => {
  const filesDir = path.join(__dirname, "../..", "src/files");
  const chunks = 3;
  const chunkName = "chunk";

  let iteration = 1;
  while (iteration <= 3) {
    const result = await handleFileChunks({
      filename: chunkName,
      buffer: String(iteration),
      chunk: iteration,
      chunks,
      filesDir,
    });

    if (result.error === undefined) {
      t.equal(result.mergedFileSize, 3);
    }
    iteration++;
  }
});
