
(() => {
    let button = document.getElementById("run");
    let cityForm = document.getElementById("city");
    let img = document.getElementById("img");
    let temp = document.getElementById("temp");
    let weatherPage = document.getElementById("weather");
    let windPage = document.getElementById("wind");
    let fiveDayForecast = document.getElementById("5days");
    //let key = 6d62f680b47ba0a60f39206b9e1a714a;
    let longitude;
    let latitude;
    let currentTemp;
    let weather;
    let wind;
    let icon;
    let forecast = [];


    //hide image until city and forecast is loaded
    document.getElementById("img").style.visibility = "hidden";

    //first call api of 5 day weather forecast, use the lat and lon data to call 7 day, daily forecasts
    button.addEventListener ("click", function () {
        let city = cityForm.value;
        fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6d62f680b47ba0a60f39206b9e1a714a")
            .then(
                function(response1) {

                    response1.json().then(function(data1) {
                        latitude = data1.city.coord.lat;
                        longitude = data1.city.coord.lon;
                        forecast.length = 0;
                        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=metric&exclude=hourly,minutely&appid=6d62f680b47ba0a60f39206b9e1a714a")
                            .then(
                                function(response2){
                                    response2.json().then(function(data2){
                                        console.log(data2);
                                        currentTemp = data2.daily[0].temp.day;
                                        weather = data2.daily[0].weather[0].main;
                                        wind = data2.daily[0].wind_speed;
                                        icon = data2.daily[0].weather[0].icon;

                                        for(i = 1; i < 6; i ++){
                                            let temperature = Math.round(data2.daily[i].temp.day);
                                            let span = "<li>" + temperature + " C" + "</li>"
                                            forecast.push(span);
                                        }

                                        currentWeather();

                                    });
                                }
                            )
                    });
                }
            )
    });


    //add the data of the current weather to the html
    currentWeather = () => {
        img.style.visibility = "visible";
        temp.innerText = Math.round(currentTemp) + " C";
        weatherPage.innerText = weather;
        windPage.innerText = Math.round((wind / 1000) * 3600) + "k/ph";
        img.src = "img/" + icon + ".png";
        fiveDayForecast.innerHTML = forecast.join("");

    };

})();