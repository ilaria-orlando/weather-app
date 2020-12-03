
(() => {
    let button = document.getElementById("run");
    let cityForm = document.getElementById("city");
    let img = document.getElementById("img");
    let temp = document.getElementById("temp");
    let weatherPage = document.getElementById("weather");
    let windPage = document.getElementById("wind");
    let fiveDaysTemp = document.getElementById("5daysTemp");
    let fiveDaysWeather = document.getElementById("5daysWeather");
    let weekdayHTML = document.getElementById("weekday");
    let root = document.getElementsByTagName( 'html' )[0];
    let longitude;
    let latitude;
    let currentTemp;
    let weather;
    let wind;
    let icon;
    let forecastTemp = [];
    let forecastWeather = [];
    let d = new Date();
    let day = d.getDay();
    let weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    let weekdayTable = [];
    let hourDay = d.getHours();

    //set background day and night by adding a class to the HTML tag
    backgroundChange = () =>{
        if(hourDay < 6 || hourDay > 18){
            root.setAttribute("class", "night");
        }
        else{
            root.setAttribute("class", "day");
        }

    }

    backgroundChange();


    //hide image until city and forecast is loaded
    document.getElementById("img").style.visibility = "hidden";

    //first call api of 5 day weather forecast, use the lat and lon data to call 7 day, daily forecasts
    button.addEventListener ("click", function () {
        let city = cityForm.value;
        fetch("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6d62f680b47ba0a60f39206b9e1a714a")
            .then(
                function(response1) {
                    if(response1.status !== 200){
                        document.getElementById("error").innerHTML = "I don't know this city :( <br> Try again please"
                    }
                    response1.json().then(function(data1) {
                        latitude = data1.city.coord.lat;
                        longitude = data1.city.coord.lon;
                        //clear the arrays with 5 day forecast information so it's reset when a new city is entered
                        forecastTemp.length = 0;
                        forecastWeather.lenght = 0;
                        weekdayTable.length = 0;
                        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=metric&exclude=hourly,minutely&appid=6d62f680b47ba0a60f39206b9e1a714a")
                            .then(
                                function(response2){
                                    response2.json().then(function(data2){
                                        //get data for current moment for the city that's entered
                                        console.log(data2);
                                        currentTemp = data2.current.temp;
                                        weather = data2.daily[0].weather[0].description;
                                        wind = data2.daily[0].wind_speed;
                                        icon = data2.daily[0].weather[0].icon;

                                        //get info for the next 5 days and push them to an array
                                        for(i = 1; i < 6; i ++){
                                            let temperature = Math.round(data2.daily[i].temp.day);
                                            let weather5days = data2.daily[i].weather[0].main;
                                            let spanTemp = "<td>" + temperature + " C" + "</td>"
                                            let spanWeather = "<td>" + weather5days + "</td>"
                                            forecastTemp.push(spanTemp);
                                            forecastWeather.push(spanWeather);
                                        }

                                        currentWeather();
                                        forecastFivedays();

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

    };

    forecastFivedays = () => {
        //push days of the week to array
        let spanWeekday;
        for(i = 0; i < 5; i++){
            if(day === 6){
                day = 0;
                spanWeekday = "<td>" + weekday[0] + "</td>"
                weekdayTable.push(spanWeekday);
            }
            else{
                day = day +1;
                spanWeekday = "<td>" + weekday[day] + "</td>"
                weekdayTable.push(spanWeekday);
            }
        }

        //add the info to the html
        weekdayHTML.innerHTML = weekdayTable.join("");
        fiveDaysTemp.innerHTML = forecastTemp.join("");
        fiveDaysWeather.innerHTML = forecastWeather.join("");


    }

})();