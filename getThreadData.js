require("dotenv").config();

const threadData = [];

const getThreadData = async (nightmare, threadUrl, page = 1) => {
  return new Promise((resolve, reject) => {
    nightmare
      .goto(`${threadUrl}/page-${page}`)
      .wait(`div.structItem`)
      .evaluate((BASE_URL) => {
        const articles = Array.from(
          document.getElementsByTagName("article")
        ).map((article) => {
          console.log(article);
        });
        return {
          nextPage: document.querySelector(".pageNav-jump--next")
            ? true
            : false,
        };
      }, process.env.KNIFEEDGE_BASE_URL)
      //.end()
      .then(async (data) => {
        threadData.push(data);
        if (publish_data.nextPage) {
          page++;
          resolve(await getThreadData(nightmare, threadUrl, page));
        } else {
          resolve(threadData);
        }
      })
      .catch(reject);
  });
};

module.exports = getThreadData;
