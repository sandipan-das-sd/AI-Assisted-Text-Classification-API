import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { classifyText } from "./api";
import "./styles.css";

const examples = [
  "My package arrived damaged and support has not replied.",
  "What time does your customer service open?",
  "The new dashboard is much easier to use.",
];

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try { setResult(await classifyText(text.trim())); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <main className="page-shell">
    <section className="intro">
      <span className="eyebrow">AI-assisted classification</span>
      <h1>Understand every<br/><span>message.</span></h1>
      <p>Sort customer text into Complaint, Query, Feedback, or Other in seconds.</p>
      <div className="features"><article><strong>4</strong><span>Clear categories</span></article><article><strong>AI</strong><span>Local and private</span></article><article><strong>REST</strong><span>Easy integration</span></article></div>
    </section>
    <section className="chat-card">
      <header className="chat-header"><div className="logo">TC</div><div><h2>Text Classifier</h2><p><span className="status-dot"/>Ollama powered</p></div></header>
      <form className="classifier" onSubmit={submit}>
        <label htmlFor="text">Text to classify</label>
        <textarea id="text" maxLength="5000" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a customer message here..." />
        <div className="form-row"><small>{text.length} / 5,000</small><button disabled={loading || !text.trim()}>{loading ? "Classifying..." : "Classify text"}</button></div>
      </form>
      {result && <section className="result" aria-live="polite"><span>Classification result</span><h3>{result.category}</h3><div className="meter"><i style={{width: `${result.confidence * 100}%`}} /></div><p>{Math.round(result.confidence * 100)}% confidence</p></section>}
      {error && <p className="error" role="alert">{error}</p>}
      <section className="examples"><h3>Try an example</h3>{examples.map((example) => <button key={example} onClick={() => { setText(example); setResult(null); }}>{example}</button>)}</section>
    </section>
  </main>;
}

createRoot(document.getElementById("app")).render(<App />);
