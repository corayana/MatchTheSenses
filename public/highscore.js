const finalScore = document.querySelector('#finalScore');
const highscoreList = document.querySelector('#highscoreList');
const result = sessionStorage.getItem('result');

displayHighscores();

async function displayHighscores() {
  finalScore.innerText = 'Du hast ' + result + ' Punkte erreicht!';

  const highscores = await sendGetRequest('/highscores');

  console.log(highscores);

  highscoreList.innerHTML =
    highscores.map(score => {
      console.log(score);
      return `<li class="high-score">${score.player} ${score.points}</li>` // Tabelle stattdessen nutzen?
    }).join('');
}
