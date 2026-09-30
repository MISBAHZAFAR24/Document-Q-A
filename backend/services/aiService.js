const fs = require("fs/promises");

const defaultAiServiceUrl = "https://document-q-a-2.onrender.com";
const configuredAiServiceUrl = process.env.AI_SERVICE_URL;
const isRenderDeployment = Boolean(process.env.RENDER_SERVICE_ID);

function isLoopbackUrl(value) {
  if (!value) return false;

  try {
    return ["localhost", "127.0.0.1", "[::1]", "::1"].includes(new URL(value).hostname);
  } catch {
    return false;
  }
}

const useDefaultAiServiceUrl = isRenderDeployment && isLoopbackUrl(configuredAiServiceUrl);
const aiServiceUrl = (
  useDefaultAiServiceUrl ? defaultAiServiceUrl : configuredAiServiceUrl || defaultAiServiceUrl
).replace(/\/+$/, "");

if (useDefaultAiServiceUrl) {
  console.warn("Ignoring loopback AI_SERVICE_URL on Render; using the deployed AI service URL.");
}

const indexedDocuments = new Map();

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.detail || body.message || "AI service request failed");
    error.statusCode = response.status >= 500 ? 502 : response.status;
    throw error;
  }

  return body;
}

async function indexDocument(document) {
  const file = await fs.readFile(document.path);
  const formData = new FormData();
  formData.append("file", new Blob([file], { type: document.mimetype }), document.name);

  const result = await requestJson(`${aiServiceUrl}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  indexedDocuments.set(document.id, result.id);
  return result.id;
}

async function answerQuestion({ question, document }) {
  let aiDocumentId = indexedDocuments.get(document.id);

  if (!aiDocumentId) {
    aiDocumentId = await indexDocument(document);
  }

  let result;
  try {
    result = await requestJson(`${aiServiceUrl}/qa/${aiDocumentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch (error) {
    if (error.statusCode !== 404) throw error;
    indexedDocuments.delete(document.id);
    aiDocumentId = await indexDocument(document);
    result = await requestJson(`${aiServiceUrl}/qa/${aiDocumentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  }

  return {
    answer: result.answer,
    citation: result.citations?.[0] || { text: "No citation found.", page: 1 },
  };
}

module.exports = { answerQuestion, indexDocument };
