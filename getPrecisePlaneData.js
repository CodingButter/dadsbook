const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });

const getPrecisePlaneDataPromise = async (plane) => {
  return new Promise((resolve, reject) => {
    const nightmare = Nightmare({ show: true });
    nightmare
      .goto(plane.link)
      .wait(".bbWrapper")
      .evaluate(() => {
        const getMainDescription = (description) => {
          const aTag = description.querySelector("a");
          aTag && description.removeChild(aTag);
          const descriptionModeledFragmentArray =
            description.innerHTML.split("Modeled");
          const descriptionFragmentArray =
            descriptionModeledFragmentArray[0].split(`<br>\n<br>\n`);
          return !descriptionFragmentArray[0].includes("span")
            ? descriptionFragmentArray[0]
            : descriptionFragmentArray[1];
        };

        const getBuildThreadLink = (description) => {
          var buildThreadLink = "";
          const buildThreadAnchor = Array.from(
            descriptionElement.getElementsByTagName("a")
          ).filter((a) => a.innerText.toLowerCase().includes("build"))[0];
          if (buildThreadAnchor)
            buildThreadLink = buildThreadAnchor.getAttribute("href");
          return buildThreadLink;
        };

        const descriptionElement = document.querySelector(".bbWrapper");
        const buildThreadLink = getBuildThreadLink(descriptionElement);
        const mainDescription = getMainDescription(descriptionElement);
        return { buildThreadLink, mainDescription };
      })
      .end()
      .then((results) => {
        plane.rawDescription = results;
        resolve(plane);
      })
      .catch(reject);
  });
};

const getPrecisePlaneDataAsync = async (plane) => {
  return getPrecisePlaneDataPromise(plane);
};

const getPrecisePlaneDataRaw = async (planes) => {
  return Promise.all(planes.map(getPrecisePlaneDataAsync));
};

const getPrecisePlaneData = async (planes) => {
  const rawResults = await getPrecisePlaneDataRaw(planes);
  return rawResults.map((plane) => {
    const { mainDescription, buildThreadLink } = plane.rawDescription;
    plane.buildThreadLink = buildThreadLink;
    plane.description = mainDescription;
    delete plane.rawDescription;
    return plane;
  });
};

module.exports = getPrecisePlaneData;
