const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-video'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#scoreText');


let currentQuestion = {}
let acceptingAnswers = true
let score = 0
let questionCounter = 0
let availableQuestions = []

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

const SCORE_POINTS = 100
const MAX_ROUNDS = 3

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuestions = [...questions]
    getNewQuestion()
    scoreText.innerText = 'Punkte ' + score;
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_ROUNDS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('end.html')
    }

    questionCounter++
    progressText.innerText = `Runde ${questionCounter} / ${MAX_ROUNDS}`
    
    const questionsIndex = Math.floor(Math.random() * availableQuestions.length)
    currentQuestion = availableQuestions[questionsIndex]
    question.src = currentQuestion.question; // set audio

    choices.forEach(choice => {
        const number = choice.dataset['number']
        choice.src = currentQuestion['choice' + number]; // set videos
    })

    availableQuestions.splice(questionsIndex, 1)

    acceptingAnswers = true
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect'

        if(classToApply === 'correct') {
            incrementScore(SCORE_POINTS)
        }

        selectedChoice.parentElement.classList.add(classToApply)

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()

        }, 1000)
    })
})

incrementScore = num => {
    score +=num;
    scoreText.innerText = 'Punkte: ' + score;
}

startGame()