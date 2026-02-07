// modules/discovery/index.js
// Discovery stage modules (ES Module)

import target from "./target.js";
import reflect from "./reflect.js";
import upgrade from "./upgrade.js";

const discovery = Object.freeze({
  index: target,     // default discovery entry point
  target,
  reflect,
  upgrade
});

export default discovery;
