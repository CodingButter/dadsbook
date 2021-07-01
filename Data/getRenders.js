const { multi } = require("./downloader");

const getRenderaLoop = async (nightmare, planes, index = 0) => {
  if (index == planes.length) {
    return planes;
  }
  const plane = planes[index];
  return new Promise((resolve, reject) => {
    nightmare
      .goto(`${plane.link}/updates`)
      .wait(".attachment")
      .evaluate(() => {
        return Array.from(document.querySelectorAll(".js-lbImage")).map(
          (a) => a.href
        );
      })
      .then(async (results) => {
        planes[index].renders = results;
        index++;
        resolve(await getRenderaLoop(nightmare, planes, index));
      })
      .catch(reject);
  });
};
const downloadAndUpdatePath = async (planes) => {
  const renders = [];
  planes.map((plane, index) => {
    return plane.renders.map((uri, renderIndex) => {
      const local = `/images/renders/${plane.name}/render-${renderIndex}.jpg`;
      const path = `${__dirname}${local}`;
      planes[index].renders[renderIndex] = { local, uri };
      renders.push({ uri, path });
    });
  });
  await multi(renders);
  return planes;
};
const getRendera = async (nightmare, planes) => {
  const planesWithRenders = await getRenderaLoop(nightmare, planes);
  return await downloadAndUpdatePath(planesWithRenders);
};

module.exports = getRendera;
