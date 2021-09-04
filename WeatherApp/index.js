const httpClient = require('http');
const fs = require('fs');
const request = require('request');
const http = require('http');
const ip = '127.0.0.1';
const port = '8000';


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%weaDes%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer(function (req, res) {

    if (req.url == "/") {

        request(
            "http://api.openweathermap.org/data/2.5/weather?q=Finland&units=metric&appid=ce41258da1612778354b6d814ba99e05",
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData.map((val) =>
                    replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
                console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });


    }

})


server.listen(port, ip, () => {
    console.log(`server running at http://${ip}:${port}/`);
});

