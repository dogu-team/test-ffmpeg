const http = require("http");
const WebSocket = require("ws");
const ffmpeg = require("ffmpeg-bin-static");
console.log(ffmpeg.path);

const { spawn } = require("child_process");
const express = require("express");
const app = express();

app.get("/download", (req, res) => {
  res.setHeader("Content-disposition", "attachment; filename=output.mp4");
  res.setHeader("Content-type", "video/mp4");
  res.download("./output.mp4");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connected");

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    ws.send(`You sent: ${message}`);

    const data = message.toString();
    console.log("Starting ffmpeg");
    const ffmpegProcess = spawn(`${ffmpeg.path} ${data}`, {
      stdio: "inherit",
      shell: true,
    });

    ffmpegProcess.on("close", (code, signal) => {
      const message = `FFmpeg process closed with code ${code} and signal ${signal}`;
      console.log(message);
      ws.send(message);
    });

    setTimeout(() => {
      ffmpegProcess.kill("SIGINT");
    }, 10000);
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
