// Sample code from activities: 

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


// Middleware for parsing JSON and URL-encoded data
/* app.use(express.json());
app.use(express.urlencoded({ extended: true })); not being used at the momment.*/
app.use(express.static('Develop/public'));

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => // this route serves up the homepage. which is defaulted to index file.
      res.sendFile(path.join(__dirname, '/assets/js/index.html'))
);

app.get('/notes', (req, res) => {// this route serves up the notes page
      // res.sendFile(path.join(__dirname, 'notes.html'));
      console.log('req.params', req.params);
      res.sendFile(path.join(__dirname, 'Develop/public/assets/notes.html'))
});

// app.get('*', (req, res) => // the default route to serve up all other request i beleive. DOUBLE CHECK!!!!
//       res.sendFile(path.join(__dirname, 'public/js/index.html'))
// );

// API ROUTES:
app.get('/api/notes', (req, res) => {
      // Read the data from db.json and send it as a JSON response
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));
      res.json(notes);
});
app.post('/api/notes', (req, res) => {
      // Read the data from db.json
      const notes = JSON.parse(fs.readFileSync('db.json', 'utf8'));

      // Create a new note object with a unique ID (using uuid)
      const newNote = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text,
      };

      // Push the new note to the existing notes array
      notes.push(newNote);

      // Write the updated notes array back to db.json
      fs.writeFileSync('db.json', JSON.stringify(notes));

      // Send the newly created note as a response
      res.json(newNote);
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));




/* TODO: 



*/

/* BUGS: 



*/ 