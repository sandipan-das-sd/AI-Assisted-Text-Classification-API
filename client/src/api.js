const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function classifyText(text) {
  const response = await fetch(`${API_URL}/api/classify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to classify the text");
  }

  return data;
}
