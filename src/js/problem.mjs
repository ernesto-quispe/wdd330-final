import { removeAllAlerts, setLocalStorage, getLocalStorage, alertMessage, loadHeaderFooter, activateOperationButtons, getParam  } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function setSettings() {
    const alias = getParam("alias");
    const operator = getParam("operator");
    const max1 = getParam("max1");
    const max2 = getParam("max2");
    const level = getParam("level");

    let gameSession = {
        "alias": alias,
        "operator": operator,
        "max1": max1,
        "max2": max2,
        "level": level,
        "correct": 0,
        "incorrect": 0
    }
    setLocalStorage(alias,gameSession);
    return alias;
}

async function getProblem(alias){

    let gameSettings = await getLocalStorage(alias)
    const dataSource = new ExternalServices();
    const problem = await dataSource.getData(gameSettings.max1, gameSettings.max2, gameSettings.level, gameSettings.operator);
    return problem;
}

export default class ProblemDetails {
    constructor() {
        this.alias = setSettings();
        this.problemDiv = document.querySelector('.problem');
        this.loaderimage = document.createElement('div');
        this.loaderimage.className ="loader";
    }
    async init() {
        //console.log(this.alias)

        await this.createProblem();
    }

    async createProblem() {
        
        this.problemDiv.innerHTML = '';
        
        this.problemDiv.appendChild(this.loaderimage);

        this.fullQuestion = await getProblem(this.alias)
        this.problemDiv.innerHTML = '';
        let question = document.createElement('h2');
        question.textContent = this.fullQuestion.question;
        let answerDiv = document.createElement('div');
        let form = document.createElement('form');
        form.action = './index.html'; // Set the form action attribute

    
        let correctAnswerElement = document.createElement('input');
        correctAnswerElement.type = 'radio';
        correctAnswerElement.name = 'answer';
        correctAnswerElement.value = this.fullQuestion.answer;
        let correctAnswerLabel = document.createElement('label');
        correctAnswerLabel.textContent = this.fullQuestion.answer;
        correctAnswerLabel.appendChild(correctAnswerElement);
    
        let allAnswers = [correctAnswerLabel];
        this.fullQuestion.wrong_answers.forEach((wrongAnswer) => {
            let wrongAnswerElement = document.createElement('input');
            wrongAnswerElement.type = 'radio';
            wrongAnswerElement.name = 'answer';
            wrongAnswerElement.value = wrongAnswer;
            let wrongAnswerLabel = document.createElement('label');
            wrongAnswerLabel.textContent = wrongAnswer;
            wrongAnswerLabel.appendChild(wrongAnswerElement);
            allAnswers.push(wrongAnswerLabel);
        });
    
        // Shuffle the array of answer elements
        for (let i = allAnswers.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
    
        // Add the shuffled answer elements to the form
        allAnswers.forEach((answer) => {
            answerDiv.appendChild(answer);
        });
        form.appendChild(answerDiv);
        let problemDetails = document.createElement('input');
        problemDetails.type = 'hidden';
        problemDetails.name = 'problemDetails';
        problemDetails.value = JSON.stringify(this.fullQuestion);

        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit Answer';

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // prevent page reload
            removeAllAlerts();
            this.score = document.querySelector("#currentScore")
            const selectedAnswer = this.getSelectedAnswer();
            this.checkAnswer(selectedAnswer);
            await this.createProblem(); // recreate the problem
          });


        form.appendChild(submitButton);
        form.appendChild(problemDetails);
        this.problemDiv.appendChild(question);
        this.problemDiv.appendChild(form);
    }

    getSelectedAnswer() {
        const radioButtons = this.problemDiv.querySelectorAll('input[name="answer"]');
        for (const radioButton of radioButtons) {
          if (radioButton.checked) {
            return radioButton.value;
          }
        }
        return null;
      }
    
      checkAnswer(selectedAnswer) {
        const correctAnswer = this.fullQuestion.answer;
        if (selectedAnswer == correctAnswer) {
          // Correct answer, update score and display correct message
          this.updateScore(1);
          alertMessage("Correct!");
        } else {
          // Incorrect answer, display incorrect message
          alertMessage("Incorrect. The correct answer is " + correctAnswer);
        }
      }
    
      updateScore(increment) {
        
        const currentScore = parseInt(this.score.textContent, 10);
        console.log(increment, currentScore)
        this.score.textContent = (currentScore + increment).toString();
      }
}
