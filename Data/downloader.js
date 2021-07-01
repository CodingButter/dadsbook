const fs = require("fs");
const request = require("request");
const shell = require("shelljs");
const Cookie = require("./cookie.json");
var download = async (
  uri,
  filename,
  overwrite = false,
  attempts = 5,
  attempt = 0
) => {
  console.log(filename);
  const pathsplit = filename.split("/");
  pathsplit.pop();
  shell.mkdir("-p", pathsplit.join("/"));
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(filename) && !overwrite) {
      request(
        uri,
        {
          method: "HEAD",
          followAllRedirects: true,
          headers: { Cookie },
        },
        (err, response, body) => {
          const url = response.request.href;
          request({
            url,
            method: "get",
            headers: { Cookie },
          })
            .pipe(fs.createWriteStream(filename))
            .on("close", resolve)
            .on("error", (error) => reject({ error, err }));
        }
      );
    } else {
      resolve(filename);
    }
  });
};
const multi = async (images, index = 0) => {
  return new Promise(async (resolve, reject) => {
    if (index < images.length) {
      const { uri, path } = images[index];
      try {
        await download(uri, path);
      } catch (error) {
        reject(error);
      }
      index++;
      resolve(await multi(images, index));
    } else {
      resolve("done");
    }
  });
};

module.exports = { download, multi };
