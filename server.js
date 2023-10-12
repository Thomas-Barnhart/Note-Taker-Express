//Dependencies of file system, express, and path
const fs = require("fs");
const express = require("express");
const path = require("path");

// Sets up the Express App
const app = express();
// Sets port for listening use port 3001
const PORT = process.env.PORT || 3001;

//Serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Route to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Route to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Route to read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

//Receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title: title,
        text: text,
        id: uniqid(),
      };
  
      readThenAppendToJson(newNote, "./db/db.json");
  
      const response = {
        status: "success",
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json("Error in posting new note");
    }
  });
  

//Delete note according to their tagged id.
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();

    //Filter all notes that does not have matching id and saved them as a new array the matching array will be deleted
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //Write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});


//listen tot he port when deployed
app.listen(PORT, () => console.log("Server listening on port " + PORT));