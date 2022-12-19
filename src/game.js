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

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    scoreText.innerText = 'Punkte ' + score;
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_ROUNDS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    incrementRound();

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    availableQuestions.splice(questionsIndex, 1);
    
    setSound();

    setVideos();   

    loadVideos();
    
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

loadVideos = () => {
    videos.forEach(video => {
        video.oncanplaythrough = function() {
        startVideosAndSound();
        }
    });
}

startVideosAndSound = () => {
    sound.play();
    videos.forEach(videos => {
        videos.play();
    });
    startTime = performance.now();
}

checkAnswer = () => {

    videos.forEach(video => {
        video.addEventListener('click', e => {
            endTime = performance.now();
            calculateSpeed();
            
            if(!acceptingAnswers) return;

            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset['number'];

            let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

            if(classToApply === 'correct') {
                incrementScore(SCORE_POINTS);
                console.log('choice correct');
            }

            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();

            }, 1000)
        })
    });
}

incrementRound = () => {
    questionCounter++;
    progressText.innerText = `Runde ${questionCounter} / ${MAX_ROUNDS}`;
}

calculateSpeed = () => {
    speed = endTime - startTime;
    console.log('Gebrauchte Geschwindikeit in Millisekunden: ' + speed);
}

incrementScore = num => {
    score +=num;
    scoreText.innerText = 'Punkte: ' + score;
}

startGame();