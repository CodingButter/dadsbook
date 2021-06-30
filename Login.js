require("dotenv").config();

const Login = async (nightmare) => {
  const loginurl = `${process.env.FORUMN_BASE_URL}/login`;
  await nightmare
    .goto(loginurl)
    .wait(`input[name=login]`)
    .type("input[name=login]", process.env.FORUMN_USERNAME)
    .type("input[type=password]", process.env.FORUMN_PASSWORD)
    .click(".button--icon--login")
    .wait(".node--unread");
};
module.exports = Login;
