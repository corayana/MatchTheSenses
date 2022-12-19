const finalScore = document.querySelector('#finalScore');
const username = localStorage.getItem('username');
const mostRecentScore = localStorage.getItem('mostRecentScore');

const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const highScoresList = document.querySelector('#highScoresList');

const MAX_HIGH_SCORES = 5;

finalScore.innerText = 'Du hast ' + mostRecentScore + ' Punkte erreicht';

saveHighScore = () => {

    const score = {
        score: mostRecentScore,
        name: username
    };

    highScores.push(score);

    highScores.sort((a, b) => {
        return b.score - a.score
    });
    highScores.splice(10);

    localStorage.setItem('highScores', JSON.stringify(highScores))
}

saveHighScore();

highScoresList.innerHTML =
    highScores.map(score => {
        return `<li class="high-score">${score.name} ${score.score}</li>` // Tabelle stattdessen nutzen?
    }).join('')