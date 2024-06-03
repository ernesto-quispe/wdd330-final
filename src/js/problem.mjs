import { addListenersRadio, removeAllAlerts, setLocalStorage, getLocalStorage, alertMessage, loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function setSettings() {
    const alias = getParam("alias");
    const operator = getParam("operator");
    const max1 = getParam("max1");
    const max2 = getParam("max2");
    const level = getParam("level");
    const correct = getParam("correct") || 0;
    const incorrect = getParam("incorrect") || 0;

    let gameSession = {
        "alias": alias,
        "operator": operator,
        "max1": max1,
        "max2": max2,
        "level": level,
        "correct": correct,
        "incorrect": incorrect
    }

    setLocalStorage(alias, operator, max1, max2, level, correct, incorrect);
    return alias;
}

export default class ProblemDetails {
    constructor() {
        this.alias = setSettings();
        this.problemDiv = document.querySelector('.problem');
        this.loaderimage = document.createElement('div');
        this.loaderimage.className = "loader";
        this.level = getParam("level");
    }
    async init() {
        //console.log(this.alias)

        await this.createProblem();
    }

    async getProblem(alias) {

        this.gameSettings = await getLocalStorage(alias)
        const dataSource = new ExternalServices();
        const problem = await dataSource.getData(this.gameSettings.max1, this.gameSettings.max2, this.gameSettings.level, this.gameSettings.operator);
        return problem;
    }

    async createProblem() {



        this.problemDiv.innerHTML = '';

        this.problemDiv.appendChild(this.loaderimage);

        this.fullQuestion = await this.getProblem(this.alias)
        this.problemDiv.innerHTML = '';
        let question = document.createElement('h2');
        question.textContent = this.fullQuestion.question;
        question.className = "question";
        let answerDiv = document.createElement('div');
        let form = document.createElement('form');
        form.className = "questionForm";
        form.action = './index.html'; // Set the form action attribute
        form.appendChild(question);


        let correctAnswerElement = document.createElement('input');
        correctAnswerElement.type = 'radio';
        correctAnswerElement.name = 'answer';
        correctAnswerElement.value = this.fullQuestion.answer;
        correctAnswerElement.className = "answerRadio"
        let correctAnswerLabel = document.createElement('label');
        correctAnswerLabel.textContent = this.fullQuestion.answer;
        correctAnswerLabel.className = "answerLabel"
        correctAnswerLabel.appendChild(correctAnswerElement);

        let allAnswers = [correctAnswerLabel];
        this.fullQuestion.wrong_answers.forEach((wrongAnswer) => {
            let wrongAnswerElement = document.createElement('input');
            wrongAnswerElement.type = 'radio';
            wrongAnswerElement.name = 'answer';
            wrongAnswerElement.value = wrongAnswer;
            wrongAnswerElement.className = "answerRadio"
            wrongAnswerElement.classList.add("wrong-answer")
            let wrongAnswerLabel = document.createElement('label');
            wrongAnswerLabel.className = "answerLabel"
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
        submitButton.className = "submitBtn"
        
        let hintIcon = document.createElement('img');
        hintIcon.src = '../public/images/hint.webp';
        hintIcon.alt = 'Hint';
        hintIcon.title = 'Disable one wrong answer.';
        hintIcon.onclick = this.disableRandomWrongAnswer;
        hintIcon.className = "hint";

        form.appendChild(hintIcon);

        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // prevent page reload
            removeAllAlerts();
            this.score = document.querySelector("#currentScore")
            const selectedAnswer = this.getSelectedAnswer();
            this.checkAnswer(selectedAnswer);

            let gameSession = getLocalStorage(this.alias);
            if (parseInt(gameSession.correct) + parseInt(gameSession.incorrect) < 3) {
                await this.createProblem(); // recreate the problem
            }
            else {

                this.gameOver();
            }
        });

        // window.onbeforeunload = function () {
        //     return 'Are you sure you want to leave this page?';
        // };

        form.appendChild(submitButton);
        form.appendChild(problemDetails);
        this.problemDiv.appendChild(form);
        addListenersRadio();
    }

    disableRandomWrongAnswer = () => {
        const wrongAnswers = document.querySelectorAll(".wrong-answer");
        const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
        const randomWrongAnswer = wrongAnswers[randomIndex];
        randomWrongAnswer.disabled = true;
        randomWrongAnswer.parentNode.style.background = "grey"; // Change the background of the parent label
        randomWrongAnswer.parentNode.style.opacity = "0.5"; //
        const hint = document.querySelector(".hint");
        // console.log(this.level)
        if (this.level == "hard") {
            hint.style.display = "none";
        }
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
            let gameSession = getLocalStorage(this.alias);
            gameSession.correct += 1;
            setLocalStorage(this.alias, gameSession.operator, gameSession.max1, gameSession.max2, gameSession.level, gameSession.correct, gameSession.incorrect)
            alertMessage("Correct!");
        } else {
            // Incorrect answer, display incorrect message
            let gameSession = getLocalStorage(this.alias);
            gameSession.incorrect += 1;
            setLocalStorage(this.alias, gameSession.operator, gameSession.max1, gameSession.max2, gameSession.level, gameSession.correct, gameSession.incorrect)

            alertMessage("Incorrect. The correct answer is " + correctAnswer);
        }
    }

    updateScore(increment) {

        const currentScore = parseInt(this.score.textContent, 10);
        // console.log(increment, currentScore)
        this.score.textContent = (currentScore + increment).toString();
    }
    gameOver() {
        const url = `../endGame/index.html?alias=${this.alias}`;
        window.location = url;
    }
}

