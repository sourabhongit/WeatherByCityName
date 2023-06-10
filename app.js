const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config(); // for .env file

const app = express();
const https = require("https");
//this line of code should be at the end of the all required packages
app.use(bodyParser.urlencoded({ extended: true }));

app.listen("3000", function () {
  console.log("Server started on port 3000.");
});

// Must send a response for this function
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const apiKey = process.env.API_KEY;
  const unit = "matric";
  const query = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&unit=" +
    unit;
  https.get(url, function (response) {
    // we use .statusCode to get the status of the response like 200,404 etc.
    console.log(response.statusCode);

    // We use ".on" when we want some data from the api
    response.on("data", function (data) {
      // "JSON.parse" takes the data in hexadecimal and convert into javaScript object or in string format.
      const weatherData = JSON.parse(data);

      // we can get the temp by going through the objects of data which we get in string format
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      console.log(temp);
      console.log(weatherDescription);
      const icon = weatherData.weather[0].icon;
      const iconLink = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>The temperature in " + query + " is " + temp + "</h1>");
      res.write("<p>The Weather is " + weatherDescription + "</p>");
      // to insert image
      res.write("<img src =" + iconLink + ">");
      res.send();
    });
  });
});
