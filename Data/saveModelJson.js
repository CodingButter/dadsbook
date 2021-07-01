const { writeFileSync } = require("fs");
const saveModelJson = (planes) => {
  try {
    writeFileSync(`${__dirname}/models.json`, JSON.stringify(planes));
    console.log("file saved");
  } catch (error) {
    console.log(error);
  }
};

module.exports = saveModelJson;
