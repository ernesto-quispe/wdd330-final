
import { loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";

import ProblemDetails from "./problem.mjs"
loadHeaderFooter();





activateOperationButtons();

const alias = getParam("alias");
let problem = new ProblemDetails();
problem.init();