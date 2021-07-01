require("dotenv").config();
const { writeFileSync } = require("fs");
const Login = async (nightmare) => {
  const loginurl = `${process.env.FORUM_BASE_URL}/login`;
  await nightmare
    .goto(loginurl)
    .wait(`input[name=login]`)
    .type("input[name=login]", process.env.FORUM_USERNAME)
    .type("input[type=password]", process.env.FORUM_PASSWORD)
    .click(".button--icon--login")
    .wait(".node--unread")
    .evaluate(() => "")
    .cookies.get()
    .then((cookies) => {
      const cookie = cookies
        .map(({ name, value }) => {
          return `${name}=${value}`;
        })
        .join("; ");
      writeFileSync("./cookie.json", JSON.stringify(cookie));
    });
};
module.exports = Login;
