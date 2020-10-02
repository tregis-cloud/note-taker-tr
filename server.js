const { json } = require("body-parser");
//Dependences
const express = require("express");
const fs = require("fs");
const path = require("path");
let db = require("./db.json");

//Setup Express APP
const app = express();
const PORT = process.env.PORT || 8080;

//Setup express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let filePath = path.join(__dirname + "/db.json");

// // GET Routes
app.get("/api/notes", function (req, res) {
  // fs.readFile(filePath, "utf-8", function (err, data) {
  //   if (err) {
  //     throw err;
  //     return json.status(500).json({
  //       error: true,
  //       data: null,
  //       message: "Unable to retrieve notes.",
  //     });
  //   }
  //   res.json(JSON.parse(data));
  // });
  res.json(db);
});

//POST Routes with error handling
app.post("/api/notes", function (req, res) {
  console.log("A", req.body);
  db.push(req.body);

  if (!req.body.title || !req.body.text) {
    return res.status(400).json({
      error: true,
      data: null,
      message: "Invalid note. Please try again.",
    });
  }
  fs.readFile(filePath, "utf-8", function (err, data) {
    req.body.id = data.length;
    console.log("D", data);
    console.log("Z", req.body.id);
    if (err) {
      throw err;
      return res.status(500).json({
        error: true,
        data: null,
        message: "Unable to retrieve notes.",
      });
    }
    console.log("B", data);
    const updatedNotes = JSON.parse(data);
    console.log("C", updatedNotes);
    updatedNotes.push(req.body);
    console.log("D", updatedNotes);

    fs.writeFile(filePath, JSON.stringify(updatedNotes), function (err) {
      if (err) {
        throw err;
        return res.status(500).json({
          error: true,
          data: null,
          message: "Unable to save new note.",
        });
      }
      res.json({
        error: false,
        data: updatedNotes,
        message: "Note successfully added.",
      });
    });
  });
});
//DELETE `/api/notes/:id` -
app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id;
  db = db.filter((note) => note.id != id);
  res.json({ message: `note ${id} was deleted.` });
});
// View Routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

//Start server to begin listening
app.listen(PORT, function () {
  console.log(`App is listening on http://localhost:${PORT}`);
});
