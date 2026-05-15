// api/chat/index.js
// TRUE AI — Discovery Entry Point (Vercel-safe, ESM)

import { resolveDiscoveryState } from "../../core/governance/resolveDiscoveryState.js";

import { runDiscovery } from "../discovery/runDiscovery.js";

import { callLLM, MODELS } from "./llm.js";


// -----------------------------
// Safe body parser for Vercel
// -----------------------------
async function parseBody(req) {
  if (req.body) return req.body;

  return new Promise((resolve) => {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}


// -----------------------------
// POST handler
// -----------------------------
async function handlePost(req, res) {
  console.log("TRUE AI /api/chat reached");

  try {
    const body = await parseBody(req);

    const {
      input = "",
      sessionState = {},
      participantProfile = {}
    } = body;

    // -----------------------------
    // Determine Discovery phase
    // -----------------------------
    const discoveryState = resolveDiscoveryState({
      input,
      sessionState,
      participantProfile
    });

    // -----------------------------
    // Run Discovery orchestration
    // -----------------------------
    const result = await runDiscovery({
      input,
      discoveryState,
      participantProfile,
      llm: async ({ prompt, maxTokens = 500 }) => {
        return callLLM({
          model: MODELS.STANDARD,
          userPrompt: prompt,
          maxTokens
        });
      }
    });

    // -----------------------------
    // Response
    // -----------------------------
    return res.status(200).json({
      success: true,

      discoveryState,

      response: result.response,

      lifeprint: result.lifeprint || null,

      metadata: {
        strengthsDetected: result.strengthsDetected || [],
        frictionDetected: result.frictionDetected || [],
        readinessLevel: result.readinessLevel || "emerging"
      }
    });

  } catch (err) {
    console.error("TRUE AI Error:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error"
    });
  }
}


// -----------------------------
// Main Vercel handler
// -----------------------------
export default async function handler(req, res) {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  // OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POST
  if (req.method === "POST") {
    return handlePost(req, res);
  }

  // Unsupported
  return res.status(405).json({
    success: false,
    error: "Method not allowed"
  });
}
