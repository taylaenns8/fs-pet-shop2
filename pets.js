#!/usr/bin/env node

import process from "node:process";
import fs from "node:fs";

const subcommand = process.argv[2];

if (subcommand === "read") {
  const petIndex = process.argv[3];
  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }

    const pets = JSON.parse(string);
    if (petIndex === undefined) {
      console.log(pets);
    } else if (petIndex < pets.length) {
      console.log(pets[petIndex]);
    } else {
      console.error(`Error: Pet index '${petIndex}' out of bounds`);
      console.error(`Usage: node pets.js read INDEX`);
      process.exit(1);
    }
  });
} else if (subcommand === "create") {
  // Do create stuff
  const age = parseInt(process.argv[3], 10);
  const kind = process.argv[4];
  const name = process.argv[5];

  if (process.argv.length !== 6 || isNaN(age) || !kind || !name) {
    console.error("Usage: node pets.js create AGE KIND NAME");
    process.exit(1);
  }
  
  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }

    const pets = JSON.parse(string);
    const newPet = { age, kind, name };
    pets.push(newPet);

    fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
      if (error) {
        throw error;
      }

      console.log(newPet);
    });
  });
  
} else if (subcommand === "update") {
  const petIndex = parseInt(process.argv[3], 10);
  const age = parseInt(process.argv[4], 10);
  const kind = process.argv[5];
  const name = process.argv[6];

  if (process.argv.length !== 7 || isNaN(petIndex) || isNaN(age) || !kind || !name) {
    console.error("Usage: node pets.js update INDEX AGE KIND NAME");
    process.exit(1);
  }

  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }

    const pets = JSON.parse(string);
    if (petIndex < pets.length) {
      pets[petIndex] = { age, kind, name };

      fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
        if (error) {
          throw error;
        }

        console.log(pets[petIndex]);
      });
    } else {
      console.error(`Error: Pet index '${petIndex}' out of bounds`);
      console.error(`Usage: node pets.js update [0-${pets.length - 1}] AGE KIND NAME`);
      process.exit(1);
    }
  });
  
} else if (subcommand === "destroy") {
  const petIndex = parseInt(process.argv[3]);
  if (isNaN(petIndex)) {
    console.error("Usage: node pets.js destroy INDEX");
    process.exit(1);
  }

  fs.readFile("pets.json", "utf8", (error, string) => {
    if (error) {
      throw error;
    }

    const pets = JSON.parse(string);
    if (petIndex < 0 || petIndex >= pets.length) {
      console.error("Index out of bounds");
      process.exit(1);
    }

    const [removedPet] = pets.splice(petIndex, 1);

    fs.writeFile("pets.json", JSON.stringify(pets), (error) => {
      if (error) {
        throw error;
      }
      console.log(removedPet);
    });
  });

} else {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
