const http = require("http");
const ffmpeg = require("ffmpeg-bin-static");
console.log("ffmpeg path: ", ffmpeg.path);
console.log("env: ", process.env);

const { spawn } = require("child_process");
const express = require("express");

const app = express();
app.use(express.text());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/record", (req, res) => {
  const data = req.body.toString();
  const ffmpegProcess = spawn(`${ffmpeg.path} ${data}`, {
    shell: true,
  });

  ffmpegProcess.on("spawn", () => {
    console.log("spawned");
  });

  ffmpegProcess.on("error", (err) => {
    console.log(err);
  });

  ffmpegProcess.stdout.setEncoding("utf8");
  ffmpegProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpegProcess.stderr.setEncoding("utf8");
  ffmpegProcess.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpegProcess.on("exit", (code, signal) => {
    const message = `FFmpeg process closed with code ${code} and signal ${signal}`;
    console.log(message);

    res.setHeader("Content-disposition", "attachment; filename=output.mp4");
    res.setHeader("Content-type", "video/mp4");
    res.download("./output.mp4");
  });

  setTimeout(() => {
    console.log("killing");
    ffmpegProcess.kill("SIGINT");
  }, 5_000);
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
