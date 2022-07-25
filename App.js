const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");
const router = express.Router();
const googleTrends = require("google-trends-api");
const WordArray = require("./wordlist");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User Connected");
  const fetchWord = () => {
    word = WordArray[Math.floor(Math.random() * WordArray.length)];
    console.log(word);
    googleTrends
      .interestByRegion({ keyword: word })
      .then((res) => JSON.parse(res))
      .then((data) => {
        country = data.default.geoMapData[0].geoName;
        sendWordToClient(word, country);
      })
      .catch(function (err) {
        console.error("Oh no there was an error", err);
      });
  };

  const sendWordToClient = (Pword, Pcountry) => {
    socket.emit("receiveWord", Pword, Pcountry);
  };

  socket.on("getWord", fetchWord);

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

server.listen(PORT, () => console.log("Server Started on port 5000"));
