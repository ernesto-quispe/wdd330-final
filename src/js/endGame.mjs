import { renderListWithTemplate, addListenersRadio, removeAllAlerts, setLocalStorage, getLocalStorage, alertMessage, loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";






function scoreTemplate(gameSession) {
    // console.log(gameSession.max1);
    let confettiContainer = document.querySelector(".confetti-container");
    let accuracy = ((parseInt(gameSession.correct) / (parseInt(gameSession.correct) + parseInt(gameSession.incorrect))) * 100).toFixed(0);
    let achievement = "";
    if (accuracy < 60) {
        achievement = "Keep Practicing"
        //confettiContainer.style.display = "none"
    }
    else if (accuracy < 85) {
        achievement = "Good Job"
        //confettiContainer.style.display = "none"

    }
    else if (accuracy > 85) {
        achievement = "Excellent Work"
    }
    let template = `
    <h2><span class="acheivement">${achievement}! </span>${gameSession.alias}</h2>
    <div class="score-box">
    <p>Score: <span class="score">${gameSession.correct}</span></p>
    <p>Accuracy: <span class="accuracy">${accuracy}%</span></p>
    </div>
    <div id="endgame-buttons">
    <a class="submitBtn" href="../problem/?alias=${gameSession.alias}&operator=${gameSession.operator}&max1=${gameSession.max1}&max2=${gameSession.max2}&level=${gameSession.level}"><p>Retry</p></a>
    <a class="submitBtn" href="/"><p>Exit</p></a>
    </div>
    
    
    
    `
    return template
}

export default class EndGame {
    constructor(alias) {
        this.alias = alias;
        this.endGameDiv = document.querySelector('.showScore');
        this.loaderimage = document.createElement('div');
        this.loaderimage.className = "loader";
    };
    async init() {
        this.gameSession = []
        this.gameSession.push(getLocalStorage(this.alias));

        document.addEventListener("DOMContentLoaded", () =>{
            this.display();
          });
    };

    display() {
        this.endGameDiv.innerHTML = '';
        this.endGameDiv.appendChild(this.loaderimage);
        
        const confettiContainer = document.querySelector('.confetti-container');

        const confetti = document.createElement('div')
        confetti.className = 'confetti'
        confettiContainer.appendChild(confetti);
        // Define an array of possible shapes
        const shapes = ['square', 'pentagram', 'rectangle', 'hexagram', 'dodecagram', 'wavy-line'];

        // Define an array of possible colors
        const colors = ['yellow', 'white', 'green', 'blue', 'red', 'pink', 'purple', 'cyan', 'steelblue', 'orange', 'indigo'];


        // Generate 50 confetti elements and add them to the container
        for (let i = 0; i < 50; i++) {
            const confettiElement = this.generateConfetti(shapes, colors);
            confetti.appendChild(confettiElement);
        }
        renderListWithTemplate(
            scoreTemplate,
            this.endGameDiv,
            this.gameSession,
            "afterbegin",
            true
        )

    }
    // Function to generate a random confetti element
    generateConfetti(shapes, colors) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const speed = Math.floor(Math.random() * 50) + 1; // Random speed between 1 and 50

        const confettiElement = document.createElement('i');
        confettiElement.className = shape;
        confettiElement.style.setProperty('--speed', speed);
        confettiElement.style.setProperty('--bg', color);

        return confettiElement;
    }

};