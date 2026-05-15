// api/chat/sessionManager.js
// TRUE AI — Lightweight Session State Manager

// --------------------------------------------------
// In-memory session store
// --------------------------------------------------
// NOTE:
// This is intentionally lightweight for early development.
//
// In production, replace with:
// - Supabase
// - Redis
// - Postgres
// - Durable KV storage
//
// This file only manages:
// - conversational continuity
// - discovery state persistence
// - lightweight participant context
//
// It should NOT contain:
// - interpretation logic
// - synthesis logic
// - LifePrint generation
// --------------------------------------------------

const sessions = new Map();


// --------------------------------------------------
// Create Session
// --------------------------------------------------
export function createSession(sessionId) {

  if (!sessionId) {
    throw new Error("Session ID required.");
  }

  const session = {
    id: sessionId,

    createdAt: Date.now(),

    updatedAt: Date.now(),

    discoveryState: "reflect",

    history: [],

    participantProfile: {},

    metadata: {
      readinessLevel: "emerging"
    }
  };

  sessions.set(sessionId, session);

  return session;
}


// --------------------------------------------------
// Get Session
// --------------------------------------------------
export function getSession(sessionId) {

  if (!sessionId) {
    return null;
  }

  return sessions.get(sessionId) || null;
}


// --------------------------------------------------
// Get Or Create Session
// --------------------------------------------------
export function getOrCreateSession(sessionId) {

  let session = getSession(sessionId);

  if (!session) {
    session = createSession(sessionId);
  }

  return session;
}


// --------------------------------------------------
// Update Discovery State
// --------------------------------------------------
export function updateDiscoveryState(
  sessionId,
  discoveryState
) {

  const session = getOrCreateSession(sessionId);

  session.discoveryState = discoveryState;

  session.updatedAt = Date.now();

  sessions.set(sessionId, session);

  return session;
}


// --------------------------------------------------
// Update Participant Profile
// --------------------------------------------------
export function updateParticipantProfile(
  sessionId,
  updates = {}
) {

  const session = getOrCreateSession(sessionId);

  session.participantProfile = {
    ...session.participantProfile,
    ...updates
  };

  session.updatedAt = Date.now();

  sessions.set(sessionId, session);

  return session;
}


// --------------------------------------------------
// Add Conversation Entry
// --------------------------------------------------
export function addToHistory(
  sessionId,
  entry = {}
) {

  const session = getOrCreateSession(sessionId);

  session.history.push({
    timestamp: Date.now(),
    ...entry
  });

  // ------------------------------------------
  // Prevent runaway memory growth
  // ------------------------------------------
  const MAX_HISTORY = 25;

  if (session.history.length > MAX_HISTORY) {
    session.history =
      session.history.slice(-MAX_HISTORY);
  }

  session.updatedAt = Date.now();

  sessions.set(sessionId, session);

  return session.history;
}


// --------------------------------------------------
// Update Metadata
// --------------------------------------------------
export function updateMetadata(
  sessionId,
  metadata = {}
) {

  const session = getOrCreateSession(sessionId);

  session.metadata = {
    ...session.metadata,
    ...metadata
  };

  session.updatedAt = Date.now();

  sessions.set(sessionId, session);

  return session;
}


// --------------------------------------------------
// Clear Session
// --------------------------------------------------
export function clearSession(sessionId) {

  if (!sessionId) return false;

  return sessions.delete(sessionId);
}


// --------------------------------------------------
// Session Snapshot
// --------------------------------------------------
export function getSessionSnapshot(sessionId) {

  const session = getSession(sessionId);

  if (!session) {
    return null;
  }

  return {
    id: session.id,

    discoveryState: session.discoveryState,

    participantProfile: session.participantProfile,

    metadata: session.metadata,

    historyCount: session.history.length,

    updatedAt: session.updatedAt
  };
}
