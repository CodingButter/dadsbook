require("dotenv").config();

var publishedPlanes = [];

const getPlaneDataArray = async (nightmare, username, page = 1) => {
  return new Promise((resolve, reject) => {
    const dadsPlanesUrl = `${process.env.FORUMN_BASE_URL}/index.php?resources/authors/${username}/&page=${page}`;

    nightmare
      .goto(dadsPlanesUrl)
      .wait(`div.structItem`)
      .evaluate((BASE_URL) => {
        const planes = Array.from(
          document.querySelectorAll("div.structItem")
        ).map((plane, planeIndex) => {
          const name = plane.querySelector("a").innerHTML;

          const link = `${BASE_URL}${plane
            .querySelector("a")
            .getAttribute("href")}`;

          const likes = plane.querySelector(".reaction")
            ? parseInt(plane.querySelector(".reaction").innerText.trim())
            : 0;

          const publishDate = parseInt(
            plane.querySelector(".u-dt").getAttribute("data-time")
          );

          const type = plane.querySelector(
            ".structItem-startDate + li"
          ).innerText;

          const downloads = parseInt(
            plane.querySelector("dd").innerText.replace(",", "")
          );
          return {
            name,
            type,
            link,
            likes,
            publishDate,
            downloads,
          };
        });

        return {
          nextPage: document.querySelector(".pageNav-jump--next")
            ? true
            : false,
          planes,
        };
      }, process.env.KNIFEEDGE_BASE_URL)
      //.end()
      .then(async (publish_data) => {
        publishedPlanes = [...publishedPlanes, ...publish_data.planes];
        if (publish_data.nextPage) {
          page++;
          resolve(await getPlaneDataArray(nightmare, username, page));
        } else {
          resolve(publishedPlanes.filter((plane) => plane.name));
        }
      })
      .catch(reject);
  });
};

module.exports = getPlaneDataArray;
