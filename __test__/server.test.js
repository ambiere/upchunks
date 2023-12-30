const t = require("tap");
const app = require("../src/server/server");
const request = require("supertest");

t.test("server should start", async (t) => {
  const response = await request(app).get("/");
  t.equal(response.statusCode, 200);
  t.match(response.body, { root: true });
});
