let countries = []; 
let leftCountry, rightCountry;
let score = 0;
let highscore = 0;

async function fetchCountries() {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    countries = data.map(country => ({
        name: country.name.common,
        area: country.area || 0,
        flag: country.flags.svg
    })).filter(c => c.area > 0);
    startGame();
}

function startGame() {
    document.getElementById("game-over").style.display = "none";
    score = 0;
    leftCountry = getRandomCountry();
    rightCountry = getRandomCountry();
    while (leftCountry.name === rightCountry.name) {
        rightCountry = getRandomCountry();
    }
    displayCountries();
    document.getElementById("score").innerText = score;
}

function getRandomCountry() {
    return countries[Math.floor(Math.random() * countries.length)];
}

function displayCountries() {
    document.getElementById("left-flag").style.backgroundImage = `url(${leftCountry.flag})`;
    document.getElementById("left-name").innerText = leftCountry.name;
    document.getElementById("left-area").innerText = leftCountry.area.toLocaleString() + " km²";

    document.getElementById("right-flag").style.backgroundImage = `url(${rightCountry.flag})`;
    document.getElementById("right-name").innerText = rightCountry.name;
    document.getElementById("right-area").innerText = '';
    document.getElementById("right-area").style.visibility = 'hidden';
    document.querySelectorAll(".guess-button").forEach(button => button.style.display = "inline-block");
}

function animateRightArea(callback) {
    let counter = 0;
    document.getElementById("right-area").style.visibility = 'visible';
    const interval = setInterval(() => {
        if (counter >= rightCountry.area) {
            clearInterval(interval);
            callback();
        } else {
            counter += Math.ceil(rightCountry.area / 50);
            document.getElementById("right-area").innerText = counter.toLocaleString() + " km²";
        }
    }, 20);
}

function checkAnswer(choice) {
    const isCorrect = (choice === 'higher' && rightCountry.area > leftCountry.area) ||
                      (choice === 'lower' && rightCountry.area < leftCountry.area);

    document.querySelectorAll(".guess-button").forEach(button => button.style.display = "none");

    animateRightArea(() => {
        if (isCorrect) {
            score++;
            document.getElementById("score").innerText = score;
            leftCountry = rightCountry;
            rightCountry = getRandomCountry();
            displayCountries();
        } else {
            document.getElementById("final-score").innerText = score;
            document.getElementById("game-over").style.display = "block";
            if (score > highscore) {
                highscore = score;
                document.getElementById("highscore").innerText = highscore;
            }
        }
    });
}

function resetGame() {
    document.getElementById("game-over").style.display = "none";
    startGame();
}

fetchCountries();
