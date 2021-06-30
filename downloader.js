const fs = require("fs");
const request = require("request");
const shell = require("shelljs");

var download = async (
  uri,
  filename,
  overwrite = false,
  attempts = 5,
  attempt = 0
) => {
  const pathsplit = filename.split("/");
  pathsplit.pop();
  shell.mkdir("-p", pathsplit.join("/"));
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(filename) && !overwrite) {
      request.head(uri, (err, res, body) => {
        if (
          !res.headers["content-type"].includes("image") &&
          attempt < attempts
        ) {
          attempt++;
          resolve(download(uri, filename, attempts, attempt));
        } else {
          request(uri)
            .pipe(fs.createWriteStream(filename))
            .on("close", resolve)
            .on("error", (error) => reject({ error, err }));
        }
      });
    } else {
      resolve(filename);
    }
  });
};
const multi = async (images, index = 0) => {
  if (index == images.length) {
    return "done";
  }
  const { uri, path } = images[index];
  await download(uri, path);
  index++;
  multi(images, index);
};

module.exports = { download, multi };
