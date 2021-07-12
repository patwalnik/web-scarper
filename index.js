import indexV1 from "./server/routes";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import configHolder from "./config/config";
import APIError from "./server/helpers/apiError";
import cluster from "cluster";
import numCPUs from "os";
import http from "http";
import http2 from "http2";
import fs from "fs";
import Handler from "./server/helpers/responseHandler";
import { STATUS_MESSAGE, STATUS_CODES } from "./server/constants/server.code";

const express = require("express");
const app = express();

//certificates
const options = {
  key: fs.readFileSync("./certificate/ssl/test.key"),
  cert: fs.readFileSync("./certificate/ssl/test.crt")
};


//logger
app.use(morgan("dev"));

//cors enable
app.options("*", cors());
app.use(cors({ origin: "http://localhost:3002" }));

//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Max-Age", "1000");
  next();
});

//all the routed to this file
app.use("/errorLogs", express.static(__dirname + "/../logs/error.log"));
app.use("/api", indexV1);

//catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError(STATUS_MESSAGE.NOTFOUND, STATUS_CODES.NOTFOUND);
  return next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    return res
      .json(Handler.response(STATUS_MESSAGE.FAILED, STATUS_CODES.SERVER_ERROR,  { message: err.message}));
  } else {
    return res.json(
      Handler.response(STATUS_MESSAGE.FAILED, STATUS_CODES.SERVER_ERROR)
    );
  }
});


//cluster is working for using all the available nodes
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs.cpus().length; i++) {
    cluster.fork();
  }
  cluster.on("exit", deadWorker => {
    //restart the worker
    let worker = cluster.fork();
    // Note the process IDS
    let newPID = worker.process.pid;
    let oldPID = deadWorker.process.pid;

    //log the event
    console.log("worker " + oldPID + " died");
    console.log("worker " + newPID + " born.");
  });
} else {
  const serverhttps = http2.createSecureServer(options);
  http.createServer(app).listen(configHolder.httpPort, () => {
    console.log(`http server created for port no ${configHolder.httpPort}`);
  });

  serverhttps.on("stream", (req, res) => {
    req.respond();
    req.end("secured connection using protocal http/2");
  });
  serverhttps.listen(configHolder.httpsPort, () => {
    console.log("https server created on port number 3003");
  });
  console.log(`Worker ${process.pid} started`);
}
