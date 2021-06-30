const { writeFileSync, fstat } = require("fs");
const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true });
const getPlaneDataArray = require("./getPlaneDataArray");
const getPrecisePlaneData = require("./getPrecisePlaneData");
const getRenders = require("./getRenders");
const getThreadData = require("./getThreadData");
const Login = require("./Login");
var planes;
(async () => {
  await Login(nightmare);
  /*
  const planeDataArray = await getPlaneDataArray(nightmare, "boof69.62828");
  const planesWithPreciseData = await getPrecisePlaneData(
    nightmare,
    planeDataArray
  );
  const planesWithRenders = await getRenders(nightmare, planesWithPreciseData);
/**/

  const planesWithRenders = require("./models.json");
  try {
    const planesWithThreadData = await getThreadData(
      nightmare,
      planesWithRenders
    );
  } catch (err) {
    console.log(err);
  }

  nightmare.end().then();
})();
