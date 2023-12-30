const fs = require("fs");

async function mergeParts({ filename, filePath, chunksDir, chunks }) {
  const stream = fs.createWriteStream(filePath);
  let iteration = 1;
  try {
    while (iteration <= chunks) {
      const chunkPath = `${chunksDir}/${filename}.part_${iteration}`;
      const buffer = await fs.promises.readFile(chunkPath);
      stream.write(buffer);
      fs.unlinkSync(chunkPath);
      iteration++;
    }
    stream.end();
    return { status: "done" };
  } catch (error) {
    console.error(error);
    return { status: "error", error };
  }
}

module.exports = mergeParts;
module.exports.mergeParts = mergeParts;
