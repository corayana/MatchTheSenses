const usernameElement = document.querySelector('#username');
const startGameBtn = document.querySelector('#startGameBtn');
const startScreen = document.querySelector('#home');
const gameScreen = document.querySelector('#game');

const audioElement = document.querySelector('#sound');
const videoElements = Array.from(document.querySelectorAll('.choice-video'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#scoreText');

let matchingIndex = null;
var startTime = 0;
let availableChallenges = [];
let currentChallenge = null;
let acceptingAnswers = false;
let matchingVideoElem = null;
let roundCounter = 0;
let score = 0;

const challenges = [
  [
    {
      audio: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp3',
      video: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp4',
      title: '',
    },
    {
      audio: '../content/Abstellen/Geschnitten_Abstellen_Messbecher.mp3',
      video: '../content/Abstellen/Geschnitten_Abstellen_Messbecher.mp4',
      title: '',
    },
    {
      audio: '../content/Abstellen/Geschnitten_Abstellen_Tasse.mp3',
      video: '../content/Abstellen/Geschnitten_Abstellen_Tasse.mp4',
      title: '',
    },
  ],
  [
    {
      audio: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Sprudelwasser.mp3',
      video: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Sprudelwasser.mp4',
      title: '',
    },
    {
      audio: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Bier.mp3',
      video: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_Bier.mp4',
      title: '',
    },
    {
      audio: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_WasserStill.mp3',
      video: '../content/Flüssigkeiten/Geschnitten_Flüssigkeiten_WasserStill.mp4',
      title: '',
    },
  ],
  [
    {
      audio: '../content/audio/Geschnitten_Rascheln_Kabel.mp3',
      video: '../content/videos/Geschnitten_Rascheln_Kabel.mp4',
      title: '',
    },
    {
      audio: '../content/audio/Geschnitten_Rascheln_Lichterkette.mp3',
      video: '../content/videos/Geschnitten_Rascheln_Lichterkette.mp4',
      title: '',
    },
    {
      audio: '../content/audio/Geschnitten_Rascheln_Stroh.mp3',
      video: '../content/videos/Geschnitten_Rascheln_Stroh.mp4',
      title: '',
    },
  ],
];

const SCORE_POINTS = 5;
const MAX_ROUNDS = 3;

startGameBtn.addEventListener('click', startGame);
usernameElement.addEventListener('keyup', () => {
  if (usernameElement.value != "") {
    console.log('field filled');
    startGameBtn.disabled = false;
  } else {
    console.log('field empty');
    startGameBtn.disabled = true;
  }
});

async function startGame() {
  startScreen.hidden = true;
  gameScreen.hidden = false;
  localStorage.setItem('username', usernameElement.value);
  roundCounter = 0;
  score = 0;
  availableChallenges = [...challenges];
  await getNewChallenge();
  scoreText.innerText = 'Punkte ' + score;
}

async function getNewChallenge() {
  if (availableChallenges.length === 0 || roundCounter > MAX_ROUNDS) {
    localStorage.setItem('mostRecentScore', score);
    return window.location.assign('highscore.html');
  }

  // increment round
  roundCounter++;
  progressText.innerText = `Runde ${roundCounter} / ${MAX_ROUNDS}`;

  // select challenge
  const challengeIndex = Math.floor(Math.random() * availableChallenges.length);
  // const challengeIndex = 0; // use this to respect order
  currentChallenge = availableChallenges.splice(challengeIndex, 1)[0];

  const numVideos = currentChallenge.length;
  const videoIndices = [];

  for (let i = 0; i < numVideos; i++) {
    videoIndices.push(i);
  }

  // choose audio/answer index randomly
  matchingIndex = Math.floor(numVideos * Math.random());
  audioElement.src = currentChallenge[matchingIndex].audio;

  // remove audio index from video indices
  videoIndices.splice(matchingIndex, 1);

  // remove videos from selection until only videoElements.length-1 are left
  while (videoIndices.length >= videoElements.length) {
    const rndIndex = Math.floor(videoIndices.length * Math.random());
    videoIndices.splice(rndIndex, 1);
  }

  // put audio index back to video indices
  videoIndices.push(matchingIndex);

  console.log('videos');

  for (let i = 0; i < videoElements.length; i++) {
    const videoElem = videoElements[i];
    const rndIndex = Math.floor(videoIndices.length * Math.random());
    const videoIndex = videoIndices.splice(rndIndex, 1)[0];
    const video = currentChallenge[videoIndex].video;

    videoElem.src = video;

    if (videoIndex === matchingIndex) {
      matchingVideoElem = videoElem;
      console.log('x', videoIndex);
    } else {
      console.log('-', videoIndex);
    }
  }

  await videosLoaded();
  startVideosAndSound();

  acceptingAnswers = true;

  // allow answer (click on video elements)
  for (let elem of videoElements) {
    elem.addEventListener('click', checkAnswer)
  }
}

async function videosLoaded() {
  let promises = videoElements.map((video) => {
    return new Promise((resolve, reject) => {
      video.addEventListener('canplaythrough', () => {
        console.log('video can play through');
        resolve();
      });
    })
  });

  await Promise.all(promises);
}

async function startVideosAndSound() {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 200);
  });

  audioElement.play();
  audioElement.loop = true;

  for (let elem of videoElements) {
    elem.play();
    elem.loop = true;
    elem.muted = true;
  };

  startTime = performance.now();
}

function checkAnswer(e) {
  if (acceptingAnswers) {
    acceptingAnswers = false;

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log('Gebrauchte Zeit: ' + (0.001 * duration).toFixed(2) + ' Sekunden');

    const selectedChoice = e.target;
    const classToApply = (selectedChoice === matchingVideoElem) ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(SCORE_POINTS, duration);
      console.log('choice correct');
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      matchingVideoElem.parentElement.classList.add('blink');
    }, 500);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      matchingVideoElem.parentElement.classList.remove('blink');

      // prevent answer (click on video elements)
      for (let elem of videoElements) {
        elem.removeEventListener('click', checkAnswer);
      }

      getNewChallenge();
    }, 2000);
  }
}

function calculateScore() {

}

function incrementScore(num, duration) {
  score += num;

  if (duration <= 5000) {
    score += 5;
  } else if (duration <= 6000) {
    score += 4;
  }

  scoreText.innerText = 'Punkte: ' + score;
}
