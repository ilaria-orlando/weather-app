
(() => {
    let button = document.getElementById("run");
    let cityForm = document.getElementById("city");
    let currentTemp;
    let weather;
    let wind;
    let forecast = [];


    button.addEventListener ("click", function () {
        let city = cityForm.value;
        fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6d62f680b47ba0a60f39206b9e1a714a")
            .then(
                function(response) {

                    response.json().then(function(data) {
                        currentTemp = data.list[0].main.temp;
                        weather = data.list[0].weather[0].main;
                        wind = data.list[0].wind.speed;
                        for(i = 0; i < 5; i ++){
                            let a = i * 8
                            let temperature = data.list[a].main.temp;
                            forecast.push(temperature);
                        }
                        currentWeather();
                        console.log(forecast);
                        console.log(wind);
                        console.log(data);
                    });
                }
            )
    });

    currentWeather = () => {
        document.getElementById("temp").innerText = Math.round(currentTemp) + " C";
        document.getElementById("weather").innerText = weather;
        document.getElementById("wind").innerText = Math.round((wind / 1000) * 3600) + "k/ph";
    };

})();