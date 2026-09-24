const { ChatOllama } = require("@langchain/ollama");
const CATEGORIES = ["Complaint", "Query", "Feedback", "Other"];

function createModel() {
  return new ChatOllama({
    baseUrl: process.env.OLLAMA_URL || "http://127.0.0.1:11434",
    model: process.env.OLLAMA_MODEL || "llama3.2:3b",
    temperature: 0,
    maxRetries: 1,
  });
}
function extractJson(content) {
  const value = typeof content === "string" ? content : JSON.stringify(content);
  const match = value.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI model did not return JSON");
  return JSON.parse(match[0]);
}
function normalizeResult(result) {
  const category = CATEGORIES.find((item) => item.toLowerCase() === String(result.category).toLowerCase());
  if (!category) throw new Error("AI model returned an unsupported category");
  const numeric = Number(result.confidence);
  const confidence = Number.isFinite(numeric) ? Math.min(1, Math.max(0, numeric)) : 0.75;
  return { category, confidence: Number(confidence.toFixed(2)) };
}
async function classifyText(text, model = createModel()) {
  const response = await model.invoke([
    { role: "system", content: `Classify the user's text into exactly one category: Complaint, Query, Feedback, or Other.
Complaint means dissatisfaction or a reported problem. Query means a question or request for information.
Feedback means an opinion, suggestion, praise, or review. Other means none of the above.
Return only valid JSON like {"category":"Query","confidence":0.95}. Confidence must be from 0 to 1.` },
    { role: "user", content: text },
  ]);
  return normalizeResult(extractJson(response.content));
}
module.exports = { CATEGORIES, classifyText, extractJson, normalizeResult };
