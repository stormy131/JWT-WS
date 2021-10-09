const path = require("path");
let users = require("../data.js");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const createAccessToken = (user) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "40s" });

const getPageMain = (req, res) => {
  if (!req.auth) return res.status(401).send("<h1>Forbidden</h1>");

  const url = req.url;
  const lastElement = url.split("/").pop();
  const page = lastElement ? lastElement + ".html" : "main.html";

  res.sendFile(path.resolve(__dirname, "../static/" + page));
};

const getPage = (req, res) => {
  const url = req.url;
  const lastElement = url.split("/").pop();
  const page = lastElement ? lastElement + ".html" : "index.html";

  //res.json({success: true});
  res.sendFile(path.resolve(__dirname, "../static/" + page));
};

const authorize = (req, res) => {
  const { username, password } = req.body;
  let flag = false;
  for (const user of users) {
    if (user.username === username && user.password === password) {
      flag = true;
      break;
    }
  }

  if (flag) {
    const token = createAccessToken({ username: req.body.username });
    const refToken = jwt.sign(
      { username: req.body.username },
      process.env.REFRESH_TOKEN_SECRET
    );
    refreshTokens.push(refToken);

    res.set({ userToken: token, refreshToken: refToken });
    console.log({ token, refToken });
    return res.redirect("/main");
  }
  res.status(401).json({ success: false, msg: "invalid user data" });
};

const createUser = (req, res) => {
  const { username, password } = req.body;
  const person = users.find((user) => user.username === username);
  if (person) {
    return res.json({ success: false, msg: "Unavaliable username" });
  }

  const newUser = { username: username, password: password };
  users.push(newUser);
  console.log("Added: ", newUser);
  currentUser = newUser;
  res.sendFile(path.resolve(__dirname, "../static/main.html"));
};

const deleteUser = (req, res) => {
  const index = users.indexOf(
    users.find((user) => user.username === currentUser.username)
  );
  users.splice(index, 1);
  console.log(users);
  res.sendFile(path.resolve(__dirname, "../static/index.html"));
};

const addInfo = (req, res) => {
  const { info } = req.body;
  const index = users.indexOf(
    users.find((user) => user.username === currentUser.username)
  );

  users[index].info = info;
  console.log(users[index]);
  res.sendFile(path.resolve(__dirname, "../static/main.html"));
};

const refreshToken = (req, res) => {
  if (!req.headers.reftoken) return res.status(401).send("Forbidden");
  if (!refreshTokens.includes(req.headers.reftoken))
    return res.status(401).send("Token is not avaliable");

  jwt.verify(
    req.headers.reftoken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, user) => {
      if (err) return res.send("Error");

      const accessToken = createAccessToken({ username: user.username });
      console.log("   NEW ----> " + accessToken);
      res.set({ userToken: accessToken });
      res.redirect("/main");
    }
  );
};

const deleteToken = (req, res) => {
    const refToken = req.headers.reftoken;
    refreshTokens = refreshTokens.filter(token => token !== refToken);
    res.send('Session was successfully ended');
};

module.exports = {
  getPage,
  authorize,
  createUser,
  deleteUser,
  addInfo,
  getPageMain,
  refreshToken,
  deleteToken
};
