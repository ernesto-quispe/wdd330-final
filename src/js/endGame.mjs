import { renderListWithTemplate, addListenersRadio, removeAllAlerts, setLocalStorage, getLocalStorage, alertMessage, loadHeaderFooter, activateOperationButtons, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";





function scoreTemplate(gameSession){
    // console.log(gameSession.max1);
    let template = `
    <h2><span class="acheivement">Excelent! </span>${gameSession.alias}</h2>
    <div class="score-box">
    <p>Score: <span class="score">${gameSession.correct}</span></p>
    <p>Accuracy: <span class="accuracy">${(parseInt(gameSession.correct) / (parseInt(gameSession.correct) + parseInt(gameSession.incorrect))) * 100}%</span></p>
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
        // console.log(this.gameSession);
        this.display();
    };

    display() {
        this.endGameDiv.innerHTML = '';
        this.endGameDiv.appendChild(this.loaderimage);

        renderListWithTemplate(
            scoreTemplate,
            this.endGameDiv,
            this.gameSession,
            "afterbegin",
            true
          )
    }
};