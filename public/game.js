const usernameField = document.querySelector('#username');
const startGameBtn = document.querySelector('#startGameBtn');
const startScreen = document.querySelector('#home');
const gameScreen = document.querySelector('#game');

const audioElement = document.querySelector('#sound');
const videoElements = Array.from(document.querySelectorAll('.choice-video'));
const videoTitle = Array.from(document.querySelectorAll('.title-overlay'))
const roundText = document.querySelector('#roundText');
const pointsText = document.querySelector('#pointsText');

const progressBar = document.querySelector('#progress-bar-inner');
const progressBarTitle = document.querySelector('.progress-bar-title');

const scorePoints = 5;
const maxRounds = 6;

const rightSound = new Audio('../assets/SFX/good-6081.mp3');
const wrongSound = new Audio('../assets/SFX/negative_beeps-6008.mp3');

rightSound.volume = 0.2;
wrongSound.volume = 0.2;

let username = '';
let matchingIndex = null;
let startTime = 0;
let availableChallenges = [];
let currentChallenge = null;
let acceptingAnswers = false;
let matchingVideoElem = null;
let roundCounter = 0;
let points = 0;
let challengeVideos = "";
let challengeAnswer = "";
let isPaused = true;

window.addEventListener("load",function() {
  setTimeout(function(){
  // This hides the address bar:
  window.scrollTo(0, 1);
  }, 0);
  });

// Array von Objekten: 2 entries (name (Kategorie) + content (=Array mit Videos)
const challenges = [{
  name: "Abstellen",
  content:
    [
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Glas.mp4',
        title: 'Glas',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Messbecher.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Messbecher.mp4',
        title: 'Messbecher',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Tasse.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Tasse.mp4',
        title: 'Tasse',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Brillenettuie.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Brillenettuie.mp4',
        title: 'Brillenettuie',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_B??rste.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_B??rste.mp4',
        title: 'Buerste',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Feuerzeug.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Feuerzeug.mp4',
        title: 'Feuerzeug',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Glaskanne.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Glaskanne.mp4',
        title: 'Glaskanne',
      },
      {
        audio: '../content/Abstellen/Geschnitten_Abstellen_Teebeutel.mp3',
        video: '../content/Abstellen/Geschnitten_Abstellen_Teebeutel.mp4',
        title: 'Teebeutel',
      },
    ],
},
{
  name: "Fl??ssigkeiten",
  content:
    [ // Fl??ssigkeiten
      {
        audio: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Bier.mp3',
        video: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Bier.mp4',
        title: 'Bier',
      },
      {
        audio: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Orangensaft.mp3',
        video: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Orangensaft.mp4',
        title: 'Orangensaft',
      },
      {
        audio: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Sprudelwasser.mp3',
        video: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Sprudelwasser.mp4',
        title: 'Sprudelwasser',
      },
      {
        audio: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_WasserStill.mp3',
        video: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_WasserStill.mp4',
        title: 'Leitungswasser',
      },
      {
        audio: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Waschmittel.mp3',
        video: '../content/Fl??ssigkeiten/Geschnitten_Fl??ssigkeiten_Waschmittel.mp4',
        title: 'Waschmittel',
      },
    ],
},
{
  name: "Rascheln",
  content:
    [ // Rascheln
      {
        audio: '../content/Rascheln/Geschnitten_Rascheln_Kabel.mp3',
        video: '../content/Rascheln/Geschnitten_Rascheln_Kabel.mp4',
        title: 'Kabel',
      },
      {
        audio: '../content/Rascheln/Geschnitten_Rascheln_Lichterkette.mp3',
        video: '../content/Rascheln/Geschnitten_Rascheln_Lichterkette.mp4',
        title: 'Lichterkette',
      },
      {
        audio: '../content/Rascheln/Geschnitten_Rascheln_Stroh.mp3',
        video: '../content/Rascheln/Geschnitten_Rascheln_Stroh.mp4',
        title: 'Stroh',
      },
    ],
},
{
  name: "Laufen",
  content:
    [ // Laufen
      {
        audio: '../content/Laufen/Geschnitten_Laufen_Plastik.mp3',
        video: '../content/Laufen/Geschnitten_Laufen_Plastik.mp4',
        title: 'Plastik',
      },
      {
        audio: '../content/Laufen/Geschnitten_Laufen_Sand.mp3',
        video: '../content/Laufen/Geschnitten_Laufen_Sand.mp4',
        title: 'Sand',
      },
      {
        audio: '../content/Laufen/Geschnitten_Laufen_Steine.mp3',
        video: '../content/Laufen/Geschnitten_Laufen_Steine.mp4',
        title: 'Steine',
      },
    ],
},
{
  name: "Fallenlassen",
  content:
    [ // Fallenlassen
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Buch.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Buch.mp4',
        title: 'Buch',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Geldbeutel.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Geldbeutel.mp4',
        title: 'Geldbeutel',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Haribo.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Haribo.mp4',
        title: 'Haribo',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Kerze.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Kerze.mp4',
        title: 'Kerze',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Radiergummi.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Radiergummi.mp4',
        title: 'Radiergummi',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Schere.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Schere.mp4',
        title: 'Schere',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Stift.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Stift.mp4',
        title: 'Stift',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Taschentuch.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Taschentuch.mp4',
        title: 'Taschentuch',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Teebeutel.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Teebeutel.mp4',
        title: 'Teebeutel',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Waescheklammer.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Waescheklammer.mp4',
        title: 'Waescheklammer',
      },
      {
        audio: '../content/Fallenlassen/Geschnitten_Fallenlassen_Zahnpasta.mp3',
        video: '../content/Fallenlassen/Geschnitten_Fallenlassen_Zahnpasta.mp4',
        title: 'Zahnpasta',
      },
    ],
},
{
  name: "Beissen",
  content:
    [ // Beissen
      {
        audio: '../content/Beissen/Geschnitten_Beissen_Bretzel.mp3',
        video: '../content/Beissen/Geschnitten_Beissen_Bretzel.mp4',
        title: 'Bretzel',
      },
      {
        audio: '../content/Beissen/Geschnitten_Beissen_Brotchip.mp3',
        video: '../content/Beissen/Geschnitten_Beissen_Brotchip.mp4',
        title: 'Brotchip',
      },
      {
        audio: '../content/Beissen/Geschnitten_Beissen_Cashew.mp3',
        video: '../content/Beissen/Geschnitten_Beissen_Cashew.mp4',
        title: 'Cashew',
      },
      {
        audio: '../content/Beissen/Geschnitten_Beissen_Oreo.mp3',
        video: '../content/Beissen/Geschnitten_Beissen_Oreo.mp4',
        title: 'Oreo',
      },
      {
        audio: '../content/Beissen/Geschnitten_Beissen_Zimtstern.mp3',
        video: '../content/Beissen/Geschnitten_Beissen_Zimtstern.mp4',
        title: 'Zimtstern',
      },
    ]
}
];

// get username stored
usernameField.value = username = sessionStorage.getItem('username') || '';
startGameBtn.disabled = (username === '');

startGameBtn.addEventListener('click', startGame);
usernameField.addEventListener('keyup', (e) => {
  username = usernameField.value;

  if (e.key !== "Enter") {
    startGameBtn.disabled = (username === '');
  } else if (username !== '') {
    startGame();
  }
});

async function startGame() {

  sessionStorage.setItem('username', username);

  startScreen.hidden = true;
  gameScreen.hidden = false;

  roundCounter = 0;
  points = 0;
  availableChallenges = [...challenges];

  setInterval(() => {
    if (!isPaused) {
      const currentTime = performance.now();
      const elapsedTime = currentTime - startTime;
      const optainablePoints = determinedPoints(elapsedTime);
      progressBarTitle.innerText = optainablePoints + ' / 10 Punkte';
    }
  }, 250);

  await getNewChallenge();
  pointsText.innerText = `Score: ${points}`;
}

async function getNewChallenge() {
  if (availableChallenges.length === 0 || roundCounter >= maxRounds) {
    // send resulting score to server
    const data = { player: username, points: points };
    sendPostRequest("/score", JSON.stringify(data));

    sessionStorage.setItem('result', points);
    return window.location.assign('highscore.html');
  }

  // increment round
  roundCounter++;
  roundText.innerText = `Runde ${roundCounter} / ${maxRounds}`;

  // select challenge
  const challengeIndex = Math.floor(Math.random() * availableChallenges.length); //random
  // const challengeIndex = 0; // use this to respect order
  currentChallenge = availableChallenges.splice(challengeIndex, 1)[0];

  const numVideos = currentChallenge.content.length;
  const videoIndices = [];

  for (let i = 0; i < numVideos; i++) {
    videoIndices.push(i);
  }

  // choose audio/answer index randomly
  matchingIndex = Math.floor(numVideos * Math.random());
  audioElement.src = currentChallenge.content[matchingIndex].audio;
  audioElement.load();

  // remove audio index from video indices
  videoIndices.splice(matchingIndex, 1);

  // remove videos from selection until only videoElements.length-1 are left
  while (videoIndices.length >= videoElements.length) {
    const rndIndex = Math.floor(videoIndices.length * Math.random());
    videoIndices.splice(rndIndex, 1);
  }

  // put audio index back to video indices
  videoIndices.push(matchingIndex);

  let logStr = "";
  challengeVideos = "";
  challengeAnswer = "";

  for (let i = 0; i < videoElements.length; i++) {
    const videoElem = videoElements[i];
    const rndIndex = Math.floor(videoIndices.length * Math.random());
    const videoIndex = videoIndices.splice(rndIndex, 1)[0];
    const video = currentChallenge.content[videoIndex].video;

    videoElem.src = video;
    videoElem.load();

    // add video title
    const title = videoTitle[i];
    title.innerText = currentChallenge.content[videoIndex].title;

    if (videoIndex === matchingIndex) {
      matchingVideoElem = videoElem;
      logStr += `[${videoIndex}] `;
      challengeVideos += currentChallenge.content[videoIndex].title + " ";
      challengeAnswer = currentChallenge.content[videoIndex].title;
    } else {
      logStr += `${videoIndex} `;
      challengeVideos += currentChallenge.content[videoIndex].title + " ";
    }
  }

  //challengeVideos = logStr;

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
    return new Promise((resolve, _) => {
      video.addEventListener('canplaythrough', () => {
        // console.log('video can play through');
        resolve();
      });
    })
  });
  await Promise.all(promises);
}

async function startVideosAndSound() {
  /*   await new Promise((resolve, _) => {
      setTimeout(resolve, 200);
    }); */

  audioElement.play();
  audioElement.loop = true;

  for (let elem of videoElements) {
    elem.pause();
    elem.play();
    // elem.load(); // muss das hier nochmal hin?
    elem.loop = true;
    elem.muted = true;
  };

  startTime = performance.now();
  isPaused = false;
  console.log("start time: " + startTime);

  progressBar.style.animationPlayState = "running";
  console.log(progressBar.style.animationPlayState);

  // decrement points in progressBar depending on time left
}


function checkAnswer(e) {
  if (acceptingAnswers) {
    progressBar.style.animationPlayState = "paused";
    isPaused = true;

    console.log(progressBar.style.animationPlayState);

    acceptingAnswers = false;

    const endTime = performance.now();
    const duration = endTime - startTime;
    let answeredCorrectly = false;
    let timeNeeded = (0.001 * duration).toFixed(2);

    //console.log(`time: ${(0.001 * duration).toFixed(2)}s`);

    const selectedChoice = e.target;
    const classToApply = (selectedChoice === matchingVideoElem) ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      console.log('choice correct');
      answeredCorrectly = true;

      points += determinedPoints(duration);
      pointsText.innerText = `Score: ${points}`;

      rightSound.play();
    } else {
      wrongSound.play();
    }

    selectedChoice.parentElement.classList.add(classToApply);

    for (let elem of videoElements) {
      if (elem !== matchingVideoElem) {
        elem.classList.add('greyedOut');
      }
    };

    setTimeout(() => {
      matchingVideoElem.parentElement.classList.add('blink');
    }, 500);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      matchingVideoElem.parentElement.classList.remove('blink');

      // prevent answer (click on video elements)
      for (let elem of videoElements) {
        elem.removeEventListener('click', checkAnswer);
        elem.classList.remove('greyedOut');
      }

      let challengeCategory = currentChallenge.name;
      let chosenAnswer = selectedChoice.parentElement.innerText;

      console.log("challengeCategory: " + challengeCategory);
      console.log("challengeVideos: " + challengeVideos);
      console.log("challengeAnswer: " + challengeAnswer);
      console.log("chosenAnswer: " + chosenAnswer);
      console.log("answeredCorrectly? " + answeredCorrectly);
      console.log("timeNeeded: " + timeNeeded)

      // send post request with challengeData to db
      const challengeData = { player: username, timeNeeded: timeNeeded, category: challengeCategory, challengeVideos: challengeVideos, challengeAnswer: challengeAnswer, chosenAnswer: chosenAnswer, answeredCorrectly: answeredCorrectly }; // TODO erg??nzen in server.js:61
      sendPostRequest("/challengeData", JSON.stringify(challengeData));

      // TODO: Video-Titel nach ABC sortieren, damit vergleichbarer?

      // reset ProgressBar
      progressBar.style.animation = 'none';
      progressBar.offsetWidth;
      progressBar.style.animation = null;
      progressBarTitle.innerText = '10 / 10 Punkte';

      getNewChallenge();
    }, 3000);
  }
}

function determinedPoints(duration) {
  let roundPoints = scorePoints;

  if (duration <= 1500) {
    roundPoints += 5;
  } else if (duration <= 2500) {
    roundPoints += 4;
  } else if (duration <= 4000) {
    roundPoints += 3;
  } else if (duration <= 5500) {
    roundPoints += 2;
  } else if (duration <= 7000) {
    roundPoints += 1;
  } else {
    roundPoints += 0;
  }

  // console.log('roundPoints: ' + roundPoints);

  return roundPoints;
}