//dependancies
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json()); 

//request handling with routes
app.get('/pets', function (req, res) {
  fs.readFile('pets.json', 'utf-8', (error, string) => {
    if (error) {
      res.status(500).send();
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send(string);
    }
  });
});

app.get(/^\/pets\/(\d+)$/, function (req, res) {
  const petIndex = parseInt(req.params[0]);
  fs.readFile('pets.json', 'utf-8', (error, string) => {
    if (error) {
      res.status(500).send();
    } else {
      const pets = JSON.parse(string);
      const pet = pets[petIndex];
      if (!pet) {
        res.status(404).send();
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(pet);
      }
    }
  });
});

app.post('/pets', function (req, res) {
    const newPet = req.body;

    // Check if age, kind, or name are missing from the request body
    if (!newPet.age || !newPet.kind || !newPet.name) {
      res.status(400).send('Missing required fields');
      return;
    }
  
    // Check if age is not an integer
    if (!Number.isInteger(newPet.age)) {
      res.status(400).send('Invalid age value');
      return;
    }
  
    fs.readFile('pets.json', 'utf-8', (error, string) => {
      if (error) {
        res.status(500).send();
      } else {
        //Parse the existing data into an array of objects
        const pets = JSON.parse(string);
  
        //Add the new pet to the array
        const newPet = req.body;
        pets.push(newPet);
  
        //Write the updated data back to the file
        fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
          if (error) {
            res.status(500).send();
          } else {
            res.status(201).send();
          }
        });
      }
    });
  });

  app.put(/^\/pets\/(\d+)$/, function (req, res) {
    const petIndex = parseInt(req.params[0]);
    const updatedPet = req.body;
  
    // Check if age, kind, or name are missing from the request body
    if (!updatedPet.age || !updatedPet.kind || !updatedPet.name) {
      res.status(400).send('Missing required fields');
      return;
    }
  
    // Check if age is not an integer
    if (!Number.isInteger(updatedPet.age)) {
      res.status(400).send('Invalid age value');
      return;
    }
  
    fs.readFile('pets.json', 'utf-8', (error, string) => {
      if (error) {
        res.status(500).send();
      } else {
        const pets = JSON.parse(string);
        const pet = pets[petIndex];
  
        if (!pet) {
          res.status(404).send();
        } else {
          pets[petIndex] = updatedPet;
  
          fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
            if (error) {
              res.status(500).send();
            } else {
              res.status(200).send();
            }
          });
        }
      }
    });
  });

  app.delete('/pets/:id', function (req, res) {
    const petIndex = parseInt(req.params.id);
    fs.readFile('pets.json', 'utf-8', (error, string) => {
      if (error) {
        res.status(500).send();
      } else {
        const pets = JSON.parse(string);
        const pet = pets[petIndex];
        if (!pet) {
          res.status(404).send();
        } else {
          pets.splice(petIndex, 1);
          fs.writeFile('pets.json', JSON.stringify(pets), (error) => {
            if (error) {
              res.status(500).send();
            } else {
              res.status(204).send();
            }
          });
        }
      }
    });
  });
  

  //listen on port
app.listen(3000, function () {
  console.log('Listening on port 3000');
});
