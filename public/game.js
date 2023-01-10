const username = document.querySelector('#username');
const startGameBtn = document.querySelector('#startGameBtn');
const startScreen = document.querySelector('#home');
const gameScreen = document.querySelector('#game');

const sound = document.querySelector('#sound');
const videos = Array.from(document.querySelectorAll('.choice-video'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#scoreText');

let questionsIndex = 0;

var startTime = 0;
var endTime = 0;
var speed = 0;

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp3', // Pfad für Audio
        choice1: '../content/Abstellen/Geschnitten_Abstellen_Messbecher.mp4', // Pfad für Video 1
        choice2: '../content/Abstellen/Geschnitten_Abstellen_Tasse.mp4', // Pfad für Video 2
        choice3: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp4', // Pfad für Video 3
        answer: 3, // Richtiges Video
    },
    {
        question: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Bier.mp3', // Pfad für Audio
        choice1: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Sprudelwasser.mp4', // Pfad für Video 1
        choice2: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Bier.mp4', // Pfad für Video 2
        choice3: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_WasserStill.mp4', // Pfad für Video 3
        answer: 2, // Richtiges Video
    },
    {
        question: '../content/audio/Geschnitten_Rascheln_Stroh.mp3', // Pfad für Audio
        choice1: '../content/videos/Geschnitten_Rascheln_Kabel.mp4', // Pfad für Video 1
        choice2: '../content/videos/Geschnitten_Rascheln_Lichterkette.mp4', // Pfad für Video 2
        choice3: '../content/videos/Geschnitten_Rascheln_Stroh.mp4', // Pfad für Video 3
        answer: 3, // Richtiges Video
    },
]

const SCORE_POINTS = 5;
const MAX_ROUNDS = 3;

username.addEventListener('keyup', () => {
    if (username.value != "") {
        console.log('field filled');
        startGameBtn.disabled = false;
    } else {
        console.log('field empty');
        startGameBtn.disabled = true;
    }
});

startGame = async () => {
    startScreen.hidden = true;
    gameScreen.hidden = false;
    localStorage.setItem('username', username.value);
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    await getNewQuestion();
    scoreText.innerText = 'Punkte ' + score;
}

startGameBtn.addEventListener('click', startGame);

getNewQuestion = async () => {
    if (questionsIndex === availableQuestions.length || questionCounter > MAX_ROUNDS) { // (availableQuestions.length === 0 || questionCounter > MAX_ROUNDS)
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('highscore.html');
    }

    incrementRound();

    // const questionsIndex = Math.floor(Math.random() * availableQuestions.length); // Frage random auswählen 
    currentQuestion = availableQuestions[questionsIndex];
    //availableQuestions.splice(questionsIndex, 1);

    questionsIndex += 1;

    setSound();

    setVideos();

    await loadVideos();

    startVideosAndSound();

    acceptingAnswers = true;

    checkForClick();
}

setSound = () => {
    sound.src = currentQuestion.question;
}

setVideos = () => {
    videos.forEach(video => {
        const number = video.dataset['number'];
        video.src = currentQuestion['choice' + number];
    });
}

loadVideos = async () => {
    let videosLoaded = videos.map(video => {
        return new Promise(function (resolve, reject) {
            video.addEventListener('canplaythrough', function () {
                console.log('video can play through');
                resolve();
            });
        })
    });
    await Promise.all(videosLoaded);
}

startVideosAndSound = async () => {
    await new Promise(resolve => {
        setTimeout(resolve, 200);
    });
    sound.play();
    sound.loop = true;
    videos.forEach(video => {
        video.play();
        video.loop = true;
        video.muted = true;
    });
    startTime = performance.now();
}

checkForClick = () => {

    videos.forEach(video => {
        video.addEventListener('click', checkAnswer)
    });
}

checkAnswer = (e) => {
    
        endTime = performance.now();
        calculateSpeed();

        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        const correctVideo = videos.find(video => {
            console.log(typeof video.dataset['number'], typeof currentQuestion.answer);
                return Number(video.dataset['number']) === currentQuestion.answer});


        if (classToApply === 'correct') {
            incrementScore(SCORE_POINTS);
            console.log('choice correct');
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
        correctVideo.parentElement.classList.add('blink');
        }, 500);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            correctVideo.parentElement.classList.remove('blink');
            videos.forEach(video => { video.removeEventListener('click', checkAnswer) });
            getNewQuestion();
        }, 2000)
    
}


incrementRound = () => {
    questionCounter++;
    progressText.innerText = `Runde ${questionCounter} / ${MAX_ROUNDS}`;
}

calculateSpeed = () => {
    speed = endTime - startTime;
    console.log('Gebrauchte Geschwindigkeit in Millisekunden: ' + speed);
}

calculateScore = () => {

}

incrementScore = (num) => {
    score += num;
    if (speed <= 5000) {
        score += 5;
    } else if (speed <= 6000) {
        score += 4;
    }
    scoreText.innerText = 'Punkte: ' + score;
}