const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 2000;

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post(
  "/upload-profile-pic",
  upload.single("profile_pic"),
  (req, res, next) => {
    const file = req.file;
    console.log(file);
    if (!file) {
      const error = new Error("please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(
      `<h2>Here is the picture:</h2>
      <p>${file.originalname}</p>
      <img src="${file.path}" width="300" alt="something"/>`
    );
    // res.sendFile(__dirname + "/" + file.path);
  }
);

const errorhandler = (err, req, res, next) => {
  console.log(err);
  return res.json({ error: err.message });
};

app.listen(port, () => {
  console.log(`Cute app listening on port ${port}`);
});
