const cardList = ["fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-diamond", "fa-bomb"];
const completeList = [...cardList, ...cardList];
let openCardsList = [];
let moves = 0;
let seconds = 0, minutes = 0, hours = 0;
let timer;
let timerStarted = false;
let starRating = 3;
/* https://www.w3schools.com/howto/howto_css_modals.asp */

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];
// Get the button that restarts the game
let btn = document.getElementById("myBtn");

btn.onclick = function () {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
    resetGame();
};

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createCard(card) {
    let ulElement = document.querySelector("ul.deck");
    ulElement.insertAdjacentHTML('beforeend', `<li class="card"><i class="fa ${card}"></i></li>`);
    ulElement.addEventListener('click', showCard);
};

window.onload = function initGame() {
    shuffle(completeList).forEach(createCard);
    initStars();
    let restartIcon = document.getElementById("restart");
    restartIcon.addEventListener('click', resetGame);
};

function setTimer() {
    timer = setTimeout(time, 1000);
};

/* example used from https://jsfiddle.net/Daniel_Hug/pvk6p/ */
function time() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    let timeElement = document.getElementById("timer");
    timeElement.innerText = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    setTimer();
};

/* 
* showCard is used to toggle the css classes and show the card which was clicked
*/
function showCard(evt) {
    if (!timerStarted) {
        setTimer();
        timerStarted = true;
    }
    if (openCardsList.length < 2) {
        let element;
        if (event.target.nodeName === 'LI') {
            element = evt.target;
        }
        else if (evt.target.parentElement.nodeName === 'LI') {
            element = evt.target.parentElement;
        }
        /* checks if the card was already clicked or is an already uncovered match */
        if (element && !element.classList.contains("match") && !element.classList.contains("open") && !element.classList.contains("show")) {
            element.classList.toggle("open");
            element.classList.toggle("show");
            addOpenCard(element);
        }
    }
};

/* Logic for the match distinction */
function addOpenCard(element) {
    if (openCardsList.length > 0) {
        openCardsList.push(element);
        incrementMove();
        if (moves == 5 || moves == 10) {
            decrementStars();
        }
        if (openCardsList[0].firstChild.className === openCardsList[1].firstChild.className) {
            setTimeout(function () { cardsMatched(openCardsList[0], openCardsList[1]) }, 500);
        }
        else {
            setTimeout(function () { hideCards(openCardsList[0], openCardsList[1]) }, 500);
        }
    }
    else {
        openCardsList.push(element);
    }
};

function gameFinished() {
    console.log("game finished");
    let modalP = document.getElementById("gameFinished");
    // Get the modal
    let modal = document.getElementById('myModal');
    modal.style.display = "block";
    modalP.textContent = `Congratulation you finished the game in ${(hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds)} with a star rating of ${starRating}!`;
    clearTimeout(timer);
};

function resetGame() {
    let ulElement = document.querySelector("ul.deck")
    ulElement.innerHTML = "";
    shuffle(completeList).forEach(createCard);
    timerStarted = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    starRating = 3;
    clearTimeout(timer);
    resetMovesTime();
    document.querySelector("ul.stars").innerHTML = "";
    initStars();
};

function decrementStars() {
    let stars = document.getElementsByClassName("fa-star");
    stars[stars.length - 1].classList.add("fa-star-o");
    stars[stars.length - 1].classList.remove("fa-star");
    starRating--;
};

function initStars() {
    let ulStarElement = document.querySelector("ul.stars");
    ulStarElement.insertAdjacentHTML('beforeend', `<li><i class="fa fa-star"></i></li>`);
    ulStarElement.insertAdjacentHTML('beforeend', `<li><i class="fa fa-star"></i></li>`);
    ulStarElement.insertAdjacentHTML('beforeend', `<li><i class="fa fa-star"></i></li>`);
};

function incrementMove() {
    moves++;
    let moveElement = document.querySelector("span");
    moveElement.innerText = moves;
};

function resetMovesTime() {
    moves = 0;
    seconds = 0;
    let moveElement = document.querySelector("span");
    let timeElement = document.getElementById("timer");
    moveElement.innerText = moves;
    timeElement.innerText = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
};

function hideCards(e1, e2) {
    e1.classList.toggle("open");
    e2.classList.toggle("open");
    e1.classList.toggle("show");
    e2.classList.toggle("show");
    openCardsList = [];
};

function cardsMatched(e1, e2) {
    e1.classList.toggle("match");
    e2.classList.toggle("match");
    openCardsList = [];
    let matchedElements = document.getElementsByClassName("match");
    if (matchedElements.length === 16) {
        gameFinished();
    }
};
/* https://www.w3schools.com/howto/howto_css_modals.asp */


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    let modal = document.getElementById('myModal');
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    let modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
};