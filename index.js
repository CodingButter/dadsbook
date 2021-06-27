const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const getPlaneDataArray = require("./getPlaneDataArray");
const getPrecisePlaneData = require("./getPrecisePlaneData");
var planes;
(async () => {
  planes = await getPlaneDataArray(nightmare, "boof69.62828");
  planes
    .filter((plane) => plane.type == "Airplane Models")
    .map(async (plane) => {});
  nightmare.end().then();
})();
