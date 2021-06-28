const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const getPlaneDataArray = require("./getPlaneDataArray");
const getPrecisePlaneData = require("./getPrecisePlaneData");
var planes;
(async () => {
  const planeDataArray = await getPlaneDataArray(nightmare, "boof69.62828");
  nightmare.end().then();
  const planesWithPreciseData = await getPrecisePlaneData(planeDataArray);
  console.log(planesWithPreciseData);
})();
