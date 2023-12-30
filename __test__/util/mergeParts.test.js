const t = require("tap");
const path = require("path");
const fs = require("fs");
const mergeParts = require("../../src/server/util/mergeParts");

t.test("should merge chunks", async (t) => {
  const filesDir = path.join(__dirname, "../..", "src/files");
  const chunksDir = path.join(__dirname, "..", "fixtures/chunks");
  const chunks = 3;
  const chunkName = "chunk";

  t.before(async () => {
    let iteration = 1;
    !fs.existsSync(chunksDir) && fs.mkdirSync(chunksDir);
    while (iteration <= chunks) {
      await fs.promises.writeFile(`${chunksDir}/${chunkName}.part_${iteration}`, String(iteration));
      iteration++;
    }
  });

  const result = await mergeParts({
    filename: chunkName,
    filePath: `${filesDir}/test.txt`,
    chunksDir,
    chunks,
  });

  t.match(result, { status: "done" });
});
