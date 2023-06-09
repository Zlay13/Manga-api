const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
const helmet = require("helmet").default;

const anime = require("./routers/anime");
const manga = require("./routers/manga");

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/anime", anime);
app.use("/manga", manga);

app.use("/", (req, res) => {
  res.send({
    status: true,
    message:
      "For more info, check outs https://github.com/sutardihardiansyah/mangapa-api",
    find_me_on: {
      twitter: "https://twitter.com/sutardihrdsyh",
      facebook: "https://www.facebook.com/sutardihardiansyah12/",
      instagram: "https://instagram.com/sutardihardiansyah",
      github: "https://github.com/sutardihardiansyah/mangapa-api",
    },
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "api path not found",
  });
});

app.listen(PORT, () => {
  console.log("Listening on PORT:" + PORT);
});
