const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

const frontendUrl = "http://localhost:3000";

app.use(cors({ credentials: true, origin: frontendUrl }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", frontendUrl);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.post("/", (req, res) => {
  const query = req.body.regex;
  let { content } = req.body;
  console.log({ query });
  console.log({ content });
  // const query = "[A-Z](\\w)*";
  // let content = "The quick brown FOX jumps over the lazy dog. It barked.";
  const regex = new RegExp(query, "g");
  const numbers = content.match(regex);

  let prev = 0;
  const result = numbers
    ?.map((number) => {
      const f = content.search(number) + prev;
      const l = f + number.length;
      content = content.slice(f - prev + number.length);
      prev = l;
      if (f == l) return null;
      return {
        match: [number, f, l],
      };
    })
    .filter((x) => x);

  console.table(result);

  res.send({
    result: {
      error: null,
      matches: result,
    },
  });
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
