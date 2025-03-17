const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import child_process for opening the browser

const server = http.createServer((req, res) => {
  let filePath = "./index.html";
  if (req.url !== "/") filePath = "." + req.url;

  const extname = path.extname(filePath);

  let contentType;
  if (extname === ".html") contentType = "text/html";
  else if (extname === ".css") contentType = "text/css";
  else if (extname === ".js") contentType = "application/javascript";
  else contentType = "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("Gamepad Viewer running at http://localhost:3000")
  const url = "http://localhost:3000";
  exec(`start ${url}`);
});
