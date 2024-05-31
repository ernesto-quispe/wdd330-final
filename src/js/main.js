
import { loadHeaderFooter, activateOperationButtons } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
loadHeaderFooter();

activateOperationButtons();

async function fetchData() {
    const dataSource = new ExternalServices();
    await dataSource.getData();
  }
  
  fetchData(); // Call the async function

// https://opentdb.com/api.php?amount=10&category=19&difficulty=easy&type=multiple

// https://opentdb.com/api.php?amount=10&category=19&difficulty=medium&type=multiple