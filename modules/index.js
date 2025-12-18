import discovery from './discovery/index.js';
import planning from './planning/index.js';
import alignment from './alignment/index.js';


// Extremely cheap routing heuristic
export function routeToModule(message, state = {}) {
const text = message.toLowerCase();


// Discovery triggers
if (!state.stage || state.stage === 'discovery') {
return discovery.route(text, state);
}


// Planning triggers
if (state.stage === 'planning') {
return planning.route(text, state);
}


// Alignment triggers
return alignment.route(text, state);
}
