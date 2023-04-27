import http from "node:http";
import fs from "node:fs";
http.createServer(function (request, response) {
    const petRegExp = /^\/pets\/(.*)$/;
    if (request.method === "GET" && request.url === "/pets") {
        fs.readFile("pets.json", "utf-8", (error, string) => {
            if (error) {
                response.statusCode = 500;
                response.end();
                return;
            }

            response.setHeader("Content-Type", "application/json");
            response.write(string);
            response.end();
        });
    } else if (request.method === "GET" && petRegExp.test(request.url)) {
        const petIndex = Number(request.url.match(petRegExp)[1]);

        fs.readFile("pets.json", "utf-8", (error, string) => {
            if (error) {
                response.statusCode = 500;
                response.end();
                return;
            }

            const pets = JSON.parse(string);
            const pet = pets[petIndex];

            if (!pet) {
                response.statusCode = 404;
                response.end();
                return;
            }

            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(pet));
        });
    } else {
      response.write("Hello!");
      response.end();
      }
    })

    .listen(3000, function() {
        console.log("Listening on port 3000");
    });
