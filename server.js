const http = require("http");
const Mongo = require("mongodb");
const databaseUrl = "mongodb://127.0.0.1:27017";
const dbName = "match-the-senses";
const scoreCollectionName = "scores";
const challengeCollectionName = "challenges";
const numHighScores = 10;

let scoreCollection = null;
let challengeCollection = null;

// list of received player scores
let scores = [];
let challengeDataSets = [];

// get port from shell or set default (8000)
const port = Number(process.env.PORT) || 8000;

// main function waiting for async functions
(async function main() {
  await connectToDb();
  await getDataFromDb();

  // create and launch server
  let server = http.createServer(handleRequest);
  server.listen(port, () => console.log(`Server listening on port ${port}`));
})();

/***********************************************************
 *
 *  helper functions
 *
 */
async function connectToDb() {
  let options = { useNewUrlParser: true, useUnifiedTopology: true };
  let mongoClient = new Mongo.MongoClient(databaseUrl, options);

  await mongoClient.connect();
  scoreCollection = mongoClient.db(dbName).collection(scoreCollectionName);
  challengeCollection = mongoClient.db(dbName).collection(challengeCollectionName);

  if (scoreCollection !== undefined && challengeCollection !== undefined) {
    console.log("Connnected to db");
  } else {
    console.log("Could not connect to db");
  }
}

async function getDataFromDb() {
  let dataArray = await scoreCollection.find().sort({ "points": -1 }).toArray();

  for (let item of dataArray) {
    scores.push({ player: item.player, points: item.points });
  }

  console.log(scores);

  dataArray = await challengeCollection.find().toArray();

  for (let item of dataArray) {
    challengeDataSets.push({ player: item.username, timeNeeded: item.timeNeeded, category: item.challengeCategory, challengeVideos: item.challengeVideos, challengeAnswer: item.challengeAnswer, chosenAnswer: item.chosenAnswer, answeredCorrectly: item.answeredCorrectly });
  }

  console.log(challengeDataSets);
}

function handlePostRequest(url, data) {
  switch (url) {
    // append score to scores
    case "/score": {
      const score = JSON.parse(data);

      // add score to scores
      scores.push(score);
      console.log(score);

      // sort scores
      scores.sort((a, b) => b.points - a.points);

      // add score to db
      scoreCollection.insertOne(score);
      delete score._id;
      break;
    }


    case "/challengeData": {
      const challengeData = JSON.parse(data);

      // add challengeData to challengeDataSets
      challengeDataSets.push(challengeData);

      // add challengeData to db
      challengeCollection.insertOne(challengeData);

      break;
    }

    // TODO
    // Get request, das json ausgibt
    // map mit strings der daten -> daten die zu gelicher challenge gehörtn akkumulieren; 
    // tag der map ist challenge id (Kategorie + videos + audioindex richtig) --> unter challenge id dann daten miteinander assoziieren 

    default:
      console.error(`unknown POST request URL: ${url}`);
      break;
  }

  return '';
}

function handleGetRequest(url) {
  switch (url) {

    case "/scores": {
      return JSON.stringify(scores);
    }

    // send highscores as JSON string
    case "/highscores": {
      const highscores = [];

      for (let i = 0; i < scores.length && numHighScores; i++) {
        const score = scores[i];
        highscores.push(score);
      }

      return JSON.stringify(highscores);
    }

    // send challengeData as JSON string
    case "/challengeData": {
      return JSON.stringify(challengeDataSets);
    }

    // clear highscores and db collection
    case "/clear": {
      scores = [];
      scoreCollection.deleteMany({});

      challengeDataSets = [];
      challengeCollection.deleteMany({});
      break;
    }

    default:
      console.error(`unknown GET request URL: ${url}`);
      break;
  }

  return '';
}

// handle POST and GET requests (application independent)
function handleRequest(request, response) {
  let requestString = "";
  let responseString = "";

  switch (request.method) {
    case "POST": {
      // concatenate request data from chunks
      request.on("data", chunk => {
        requestString += chunk;
      });

      // handle request with given data
      request.on("end", () => {
        responseString = handlePostRequest(request.url, requestString);
        sendResponse(response, responseString);
      });
      break;
    }
    case "GET": {
      let responseString = handleGetRequest(request.url);
      sendResponse(response, responseString);
      break;
    }
  }
}

// send response with given string (application independent)
function sendResponse(response, responseString) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/plain");
  response.write(responseString);
  response.end();
}
