const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createApp } = require("./src/app");
const { normalizeResult } = require("./src/services/classificationService");
let server;
let baseUrl;
before(async () => {
  server = createApp({ classificationService: { classifyText: async () => ({ category: "Complaint", confidence: 0.94 }) } }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((resolve) => server.close(resolve)));
test("POST /api/classify returns category and confidence", async () => {
  const response = await fetch(`${baseUrl}/api/classify`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: "My order arrived broken." }) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { category: "Complaint", confidence: 0.94 });
});
test("POST /api/classify rejects empty text", async () => {
  const response = await fetch(`${baseUrl}/api/classify`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: " " }) });
  assert.equal(response.status, 400);
});
test("normalizes model results", () => assert.deepEqual(normalizeResult({ category: "query", confidence: 2 }), { category: "Query", confidence: 1 }));
