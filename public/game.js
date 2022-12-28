const username = document.querySelector('#username');
const startGameBtn = document.querySelector('#startGameBtn');
const startScreen = document.querySelector('#home');
const gameScreen = document.querySelector('#game');

const sound = document.querySelector('#sound');
const videos = Array.from(document.querySelectorAll('.choice-video'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#scoreText');

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
        question: '../content/audio/Geschnitten_Rascheln_Kabel.mp3', // Pfad für Audio
        choice1: '../content/videos/Geschnitten_Rascheln_Kabel.mp4', // Pfad für Video 1
        choice2: '../content/videos/Geschnitten_Rascheln_Lichterkette.mp4', // Pfad für Video 2
        choice3: '../content/videos/Geschnitten_Rascheln_Stroh.mp4', // Pfad für Video 3
        answer: 1, // Richtiges Video
    },
    {
        question: '../content/audio/Geschnitten_Rascheln_Lichterkette.mp3', // Pfad für Audio
        choice1: '../content/videos/Geschnitten_Rascheln_Kabel.mp4', // Pfad für Video 1
        choice2: '../content/videos/Geschnitten_Rascheln_Lichterkette.mp4', // Pfad für Video 2
        choice3: '../content/videos/Geschnitten_Rascheln_Stroh.mp4', // Pfad für Video 3
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

const SCORE_POINTS = 100;
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
    if (availableQuestions.length === 0 || questionCounter > MAX_ROUNDS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('highscore.html');
    }

    incrementRound();

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    availableQuestions.splice(questionsIndex, 1);

    setSound();

    setVideos();

    await loadVideos();

    startVideosAndSound();

    acceptingAnswers = true;

    checkAnswer();
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
        setTimeout(resolve, 500);
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

checkAnswer = () => {

    videos.forEach(video => {
        video.addEventListener('click', e => {
            endTime = performance.now();
            calculateSpeed();

            if (!acceptingAnswers) return;

            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset['number'];

            let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

            if (classToApply === 'correct') {
                incrementScore(SCORE_POINTS);
                console.log('choice correct');
            }

            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 2000)
        })
    });
}

incrementRound = () => {
    questionCounter++;
    progressText.innerText = `Runde ${questionCounter} / ${MAX_ROUNDS}`;
}

calculateSpeed = () => {
    speed = endTime - startTime;
    console.log('Gebrauchte Geschwindigkeit in Millisekunden: ' + speed);
}

incrementScore = num => {
    score += num;
    scoreText.innerText = 'Punkte: ' + score;
}