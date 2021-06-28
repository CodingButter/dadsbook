const { writeFileSync, fstat } = require("fs");
const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const getPlaneDataArray = require("./getPlaneDataArray");
const getPrecisePlaneData = require("./getPrecisePlaneData");
var planes;
(async () => {
  const planeDataArray = await getPlaneDataArray(nightmare, "boof69.62828");
  nightmare.end().then();
  const planesWithPreciseData = await getPrecisePlaneData(planeDataArray);

  writeFileSync(
    `${__dirname}/models.json`,
    JSON.stringify(
      planesWithPreciseData.sort((a, b) => (a.type > b.type ? 1 : -1)),
      null,
      2
    )
  );
})();
