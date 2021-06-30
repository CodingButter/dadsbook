const { multi } = require("./downloader");
const saveModelJson = require("./saveModelJson");

require("dotenv").config();

const getThreadDataLoop = async (nightmare, plane, pageLink) => {
  if (pageLink.length > 0) {
    return new Promise((resolve, reject) => {
      nightmare
        .goto(pageLink)
        .wait(`.p-footer-copyright`)
        .evaluate(
          async ({ PLANE_NAME }) => {
            const articles = Array.from(
              document.querySelectorAll(".message--post")
            ).map((article, articleIndex) => {
              const messageName =
                article.querySelector(".message-name").innerText;
              const dateTime = parseInt(
                article.querySelector(".u-dt").getAttribute("data-time")
              );
              const body = article.querySelector(".bbWrapper").innerHTML;
              const attachments = Array.from(
                article.querySelectorAll(".js-lbImage")
              )
                .filter((a) => a.href.includes("jpg"))
                .map((a, attachmentIndex) => {
                  return {
                    uri: a.href,
                    path: `./images/threads/${PLANE_NAME}/article-${articleIndex}-attachment-${attachmentIndex}.jpg`,
                  };
                });

              return { messageName, dateTime, body, attachments };
            });

            return {
              articles,
              nextPage: document.querySelector(".pageNav-jump--next")
                ? document.querySelector(".pageNav-jump--next").href
                : false,
            };
          },
          { PLANE_NAME: plane.name }
        )
        //.end()
        .then(async (data) => {
          plane.threadData = [...plane.threadData, ...data.articles];
          if (data.nextPage) {
            resolve(await getThreadDataLoop(nightmare, plane, data.nextPage));
          } else {
            var allAttachments = [];
            plane.threadData.forEach((article) => {
              allAttachments = [...allAttachments, ...article.attachments];
            });
            await multi(allAttachments);
            resolve(plane);
          }
        })
        .catch(reject);
    });
  } else {
    return Promise.resolve(plane);
  }
};

const getThreadData = async (nightmare, planes, index = 0) => {
  return new Promise(async (resolve, reject) => {
    const plane = planes[index];
    if (index < planes.length) {
      plane.threadData = [];
      planes[index] = await getThreadDataLoop(
        nightmare,
        plane,
        plane.buildThreadLink
      );
      index++;

      saveModelJson(planes);
      await getThreadData(nightmare, planes, index);
    } else {
      resolve(planes);
    }
  });
};

module.exports = getThreadData;
