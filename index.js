const { writeFileSync, fstat } = require("fs");
const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const getPlaneDataArray = require("./getPlaneDataArray");
const getPrecisePlaneData = require("./getPrecisePlaneData");
const getRenders = require("./getRenders");
const Login = require("./Login");
var planes;
(async () => {
  Login(nightmare);
  const planeDataArray = await getPlaneDataArray(nightmare, "boof69.62828");
  const planesWithPreciseData = await getPrecisePlaneData(
    nightmare,
    planeDataArray
  );
  const planesWithRenders = await getRenders(nightmare, planesWithPreciseData);

  nightmare.end().then();

  writeFileSync(
    `${__dirname}/models.json`,
    JSON.stringify(
      planesWithRenders.sort((a, b) => (a.type > b.type ? 1 : -1)),
      null,
      2
    )
  );
})();
