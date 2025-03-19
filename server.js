const http = require("http");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // For opening the browser

const isPackaged = typeof process.pkg !== "undefined";
const basePath = isPackaged ? path.dirname(process.execPath) : __dirname;

const server = http.createServer((req, res) => {
  let filePath = path.join(basePath, "assets", "index.html");

  // Dynamically resolve file paths based on the URL
  if (req.url !== "/") {
    filePath = path.join(basePath, "assets", req.url);
  }

  // Determine the file extension to set the appropriate Content-Type
  const extname = path.extname(filePath);
  let contentType;

  switch (extname) {
    case ".html":
      contentType = "text/html";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "application/javascript";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    default:
      contentType = "text/plain";
  }

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

// Start server on port 3000
server.listen(3000, () => {
  console.log("Gamepad Viewer running at http://localhost:3000")
  const url = "http://localhost:3000";
  exec(`start ${url}`);
});