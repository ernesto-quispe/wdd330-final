import { loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";

import EndGame from "./endGame.mjs"


loadHeaderFooter();
const alias = getParam("alias");

let endGame = new EndGame(alias);

endGame.init();