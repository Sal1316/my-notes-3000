
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('Develop/public')); // this gives 'ACCESS' to the public folder, but you still have to provide the routes to it.

const PORT = process.env.PORT || 3001;

// Pages to serve up to the client. Different than the ones below.  
app.get('/', (req, res) => // this route serves up the homepage. which is defaulted to index file.
      res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

app.get('/notes', (req, res) => {// this route serves up the notes page
      console.log('req.params', req.params);
      
      res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
});


// These routes are for handling request to the api endpoints only. the can read static data and render it back to the client.
app.get('/api/notes', (req, res) => {
      console.log('__direname', __dirname)

      const dbFilePath = path.join(__dirname, 'db.json');

      fs.readFile('./Develop/db/db.json', 'utf8', (err, data) => {

            if (err) {
                  console.error(err);
                  return res.status(404).json({ error: 'ObjEct nOt FouNd iN the SpeCiFied DirEctoRy' });
            }

            const notes = JSON.parse(data);

            res.json(notes);
      });
});
app.post('/api/notes', (req, res) => {
      // Read the data from db.json
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

      const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text,
      };

      notes.push(newNote);
  
      fs.writeFileSync('./Develop/db/db.json', JSON.stringify(notes));

      res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {

      const notes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf8'));// WORKS fine.
      console.log("notes", notes);

      const noteIndex = notes.findIndex((note) => note.id === req.params.id);

      if (noteIndex === -1) {
            return res.status(404).json({ error: 'NotE nOt fOunD' });
      }

      notes.splice(noteIndex, 1);

      fs.writeFileSync('./Develop/db/db.json', JSON.stringify(notes));

      res.json({ message: 'NOtE dElEtEd' });
});

app.listen(PORT, () => console.log(`App lIstEniNg at http://localhost:${PORT}`));


