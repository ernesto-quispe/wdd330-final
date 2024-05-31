
import { loadHeaderFooter, activateOperationButtons } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
loadHeaderFooter();

activateOperationButtons();
const dataSource = new ExternalServices();

const data = await dataSource.getData();

// https://opentdb.com/api.php?amount=10&category=19&difficulty=easy&type=multiple

// https://opentdb.com/api.php?amount=10&category=19&difficulty=medium&type=multiple