const http = require("http");
console.log("env: ", process.env);

const { spawn, execSync } = require("child_process");
const express = require("express");

const app = express();
app.use(express.text());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/record", (req, res) => {
  let buf = "none"
  try{
    buf = execSync("kvm-ok").toString('utf-8');
  }catch(e){
    buf = e.toString('utf-8');
  }

  let devKvm = "none";
  try{
    devKvm = execSync("cat /dev/kvm").toString('utf-8');
  }catch(e){
    devKvm = e.toString('utf-8');
  }

  let cpuInfo = "none";
  try{
    cpuInfo = execSync("cat /proc/cpuinfo").toString('utf-8');
  }catch(e){
    cpuInfo = e.toString('utf-8');
  }
  console.log('kvm-ok: ', buf);
  console.log('dev/kvm: ', devKvm);
  console.log('cpuInfo: ', cpuInfo);

  res.setHeader("Content-disposition", "attachment; filename=output.mp4");
  res.setHeader("Content-type", "video/mp4");
  res.setHeader("Content-type", "video/mp4");
  res.download("./output.mp4");
  // const data = req.body.toString();
  // const ffmpegProcess = spawn("ffmpeg", [
  //   "-f",
  //   "x11grab",
  //   "-s",
  //   "1920x1080",
  //   "-i",
  //   process.env.DISPLAY,
  //   "-r",
  //   "30",
  //   "output.mp4",
  // ]);

  // ffmpegProcess.on("spawn", () => {
  //   console.log("spawned");
  // });

  // ffmpegProcess.on("error", (err) => {
  //   console.log(err);
  // });

  // ffmpegProcess.stdout.setEncoding("utf8");
  // ffmpegProcess.stdout.on("data", (data) => {
  //   console.log(data.toString());
  // });

  // ffmpegProcess.stderr.setEncoding("utf8");
  // ffmpegProcess.stderr.on("data", (data) => {
  //   console.log(data.toString());
  // });

  // ffmpegProcess.on("exit", (code, signal) => {
  //   const message = `FFmpeg process closed with code ${code} and signal ${signal}`;
  //   console.log(message);

  //   res.setHeader("Content-disposition", "attachment; filename=output.mp4");
  //   res.setHeader("Content-type", "video/mp4");
  //   res.download("./output.mp4");
  // });

  // setTimeout(() => {
  //   console.log("killing");
  //   ffmpegProcess.kill("SIGINT");
  //   setTimeout(() => {
  //     console.log("killing");
  //     ffmpegProcess.kill();
  //   }, 5_000);
  // }, 5_000);
});

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
