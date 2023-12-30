const t = require("tap");
const request = require("supertest");
const app = require("../../src/server/server");
const path = require("path");

t.test("should upload file chunk", async (t) => {
  let iteration = 1;
  const fileSize = 21;
  while (iteration <= 3) {
    const filePath = path.join(__dirname, "..", `fixtures/files/chunk-${iteration}.txt`);
    const response = await request(app)
      .post("/v0/api/upchunks/file")
      .attach("file", filePath)
      .field("chunk", iteration)
      .field("chunks", 3)
      .field("fileSize", fileSize)
      .field("originalname", "test.txt")
      .set("Content-Type", "multipart/form-data");
    if (response.body.fileId && response.statusCode === 200) {
      t.ok(response.body, "Returned body");
      t.equal(response.statusCode, 200);
      t.equal(response.body.size, 21);
      t.match(response.body.originalname, "test.txt");
    }
    iteration++;
  }
});
