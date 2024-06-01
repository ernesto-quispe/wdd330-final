
import { loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";

import ProblemDetails from "./problem.mjs"
loadHeaderFooter();





activateOperationButtons();

let problem = new ProblemDetails();
problem.init();





// async function fetchData() {
//   const alias = getParam("alias");
//   const operator = getParam("operator");
//   const max1 = getParam("max1");
//   const max2 = getParam("max2");
//   const level = getParam("level");

//   let gameSettings = {
//     "alias": alias,
//     "operator": operator,
//     "max1": max1,
//     "max2": max2,
//     "level": level
//   }
//   const dataSource = new ExternalServices();
//   await dataSource.getData(max1, max2, level, operator);
// }

// fetchData(); // Call the async function

