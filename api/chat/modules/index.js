// api/chat/modules/index.js
// Global module registry for TRUE (ESM)

import discovery from "./discovery/index.js";
import sustainment from "./sustainment/index.js";
import alignment from "./alignment/index.js";

const modules = Object.freeze({
  discovery: Object.freeze(discovery),
  sustainment: Object.freeze(sustainment),
  alignment: Object.freeze(alignment),
});

export default modules;
