const Nightmare = require("nightmare");

const getPrecisePlaneDataPromise = async (plane) => {
  return new Promise((resolve, reject) => {
    const nightmare = Nightmare({ show: true });
    nightmare
      .goto(plane.link)
      .wait(".bbWrapper")
      .evaluate(() => {
        function camelize(str) {
          return str.replace(
            /(?:^\w|[A-Z]|\b\w|\s+)/g,
            function (match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toLowerCase() : match.toUpperCase();
            }
          );
        }

        const getMainDescription = (description) => {
          Array.from(description.querySelectorAll("a")).forEach((aTag) =>
            description.removeChild(aTag)
          );
          Array.from(description.querySelectorAll("img")).forEach((imgTag) =>
            description.removeChild(imgTag)
          );
          return description.innerHTML
            .split(`<br>\n`)
            .filter(
              (fragment) =>
                !fragment.includes("by..") && !fragment.includes("by ..")
            )
            .join(`<br>\n`);
        };

        const getCredits = (description) => {
          const credits = {};
          var fragments = description.innerHTML
            .split(`<br>\n`)
            .filter(
              (fragment) =>
                fragment.includes("by..") || fragment.includes("by ..")
            )
            .forEach((line) => {
              const keyval = line.split(".").filter((split) => split != "");
              const bTag = document.createElement("b");
              bTag.innerHTML = keyval[1].trim();
              const value = bTag.innerText;
              credits[camelize(keyval[0].replace(/[^a-z0-9]/gi, " "))] = value;
            });
          return credits;
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
        const credits = getCredits(descriptionElement);
        credits.modeledBy = credits.modeledBy || credits.modelBy;
        credits.modelBy && delete credits.modelBy;
        return { buildThreadLink, mainDescription, credits };
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
    const { mainDescription, buildThreadLink, credits } = plane.rawDescription;
    plane.buildThreadLink = buildThreadLink;
    plane.description = mainDescription;
    plane.credits = credits;
    delete plane.rawDescription;
    return plane;
  });
};

module.exports = getPrecisePlaneData;
