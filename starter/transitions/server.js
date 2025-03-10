import http from "node:http";

const scores = Array.from({ length: 5 }, () => ({
  home: 0,
  away: 0,
}));

// times in milliseconds
const WAIT_TIME = 5000;
const MIN_SCORE_INTERVAL = 10000;
const MAX_SCORE_INTERVAL = 60000;

const getNextInterval = () =>
  Math.floor(Math.random() * (MAX_SCORE_INTERVAL - MIN_SCORE_INTERVAL)) +
  MIN_SCORE_INTERVAL;

function incrementTeamScore(team, index) {
  scores[index][team] += 1;
  rerenderScores();
  setTimeout(() => incrementTeamScore(team, index), getNextInterval());
}

scores.forEach((_, index) => {
  incrementTeamScore("home", index);
  incrementTeamScore("away", index);
});

function rerenderScores() {
  console.clear();
  scores.forEach((score, index) => {
    console.log(
      `Game ${index + 1}:\t\t HOME: ${score.home} \t – \t AWAY: ${score.away}`
    );
  });
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/score")) {
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
    const url = new URL(req.url, `http://${req.headers.host}`);
    const game = url.searchParams.get("game");
    if (game !== null && scores[+game - 1]) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(scores[+game - 1]));
    } else {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: 400, message: "Invalid game parameter" })
      );
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: 404 }));
  }
});

const PORT = process.env.PORT ?? 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
