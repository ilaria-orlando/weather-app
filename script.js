
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
    let root = document.getElementsByTagName( "html" )[0];
    let body = document.body;
    let themeButton = document.getElementById("theme");
    let table = document.getElementById("table");
    let chart = document.getElementById("chart").getContext("2d");
    let longitude;
    let latitude;
    let currentTemp;
    let weather;
    let wind;
    let icon;
    let forecastTemp = [];
    let forecastWeather = [];
    let chartArray = [];
    let d = new Date();
    let day;
    let weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"]
    let weekdayTable = [];
    let weekdayChart = [];
    let hourDay = d.getHours();

    //hide image and table until city and forecast is loaded
    img.style.visibility = "hidden";
    table.style.visibility = "hidden";


    //function grouping the dark theme classes
    darkTheme = () => {
        root.classList.toggle("night");
        body.classList.toggle("bodynight");
        table.classList.toggle("nightcolors");
        cityForm.classList.toggle("nightcolors");
    }

    //automatic day and night them switch according to hours of the day
   backgroundChangeAuto = () =>{
        if(hourDay < 6 || hourDay > 18){
            darkTheme();
        }

    }

    backgroundChangeAuto();


   // set toggle button to switch between dark and light theme by users choice.
   themeButton.addEventListener("click", function () {
       darkTheme();
   });

    getLocation = ( ) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
                day = d.getDay();
                longLatApi();
            });
        }
        else {
            console.log(`Geolocation is not supported by this browser.`);
        }
    }
    getLocation();

    longLatApi = () => {
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=metric&exclude=hourly,minutely&appid=6d62f680b47ba0a60f39206b9e1a714a")
            .then(
                function(response2){
                    response2.json().then(function(data2){
                        //get data for current moment for the city that's entered
                        console.log(data2);
                        currentTemp = data2.current.temp;
                        weather = data2.daily[0].weather[0].description;
                        wind = data2.current.wind_speed;
                        icon = data2.current.weather[0].icon;

                        //get info for the next 5 days and push them to an array
                        for(i = 1; i < 6; i ++){
                            let temperature = Math.round(data2.daily[i].temp.day);
                            let weather5days = data2.daily[i].weather[0].main;
                            let spanTemp = "<td>" + temperature + "°c" + "</td>"
                            let chartTemp = temperature;
                            let spanWeather = "<td>" + weather5days + "</td>"
                            forecastTemp.push(spanTemp);
                            forecastWeather.push(spanWeather);
                            chartArray.push(chartTemp);
                        }

                        currentWeather();
                        forecastFivedays();
                        lineChart();
                        console.log(day);
                        console.log(weekdayTable);

                    });
                }
            )
    }


    //first call api of 5 day weather forecast, use the lat and lon data to call 7 day, daily forecasts
    button.addEventListener ("click", function () {
        let city = cityForm.value;
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=6d62f680b47ba0a60f39206b9e1a714a")
            .then(
                function(response1) {
                    if(response1.status !== 200){
                        document.getElementById("error").innerHTML = "I don't know this city :( <br> Try again please";
                    }else{
                        document.getElementById("error").innerHTML = "";
                    }
                    response1.json().then(function(data1) {
                        latitude = data1.city.coord.lat;
                        longitude = data1.city.coord.lon;
                        //clear the arrays with 5 day forecast information so it's reset when a new city is entered
                        forecastTemp.length = 0;
                        forecastWeather.length = 0;
                        weekdayTable.length = 0;
                        chartArray.length = 0;
                        weekdayChart.length = 0;
                        //define day of the week each time button is clicked so it will not just keep adding it up
                        day = d.getDay();
                        longLatApi();
                    });
                }
            )
    });

    //line chart drawn with the tamperature values of the next 5 days
    lineChart = () =>{
        let myChart = new Chart(chart, {
            type: "line",
            data: {
                labels: weekdayChart,
                datasets: [{
                    label: "Temp",
                    data: chartArray,
                    fill: false,
                    borderColor: 'rgb(108, 82, 161)',
                    borderWidth: 2
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            display: false,

                        }
                    }]
                }
            },
        });
    }




    //add the data of the current weather to the html
    currentWeather = () => {
        img.style.visibility = "visible";
        table.style.visibility = "visible";
        temp.innerText = Math.round(currentTemp) + "°c";
        weatherPage.innerText = weather;
        windPage.innerText = Math.round((wind / 1000) * 3600) + "km/ph";
        img.src = "img/" + icon + ".png";

    };

    forecastFivedays = () => {
        //push days of the week to array
        let spanWeekday;
        let daysForchart
        for(i = 0; i < 5; i++){
            // reset week if day is on day 6
            if(day === 6){
                day = 0;
                spanWeekday = "<td>" + weekday[0] + "</td>"
                daysForchart = weekday[0];
                weekdayTable.push(spanWeekday);
                weekdayChart.push(daysForchart);
            }
            else{
                day = day +1;
                spanWeekday = "<td>" + weekday[day] + "</td>"
                daysForchart = weekday[day];
                weekdayTable.push(spanWeekday);
                weekdayChart.push(daysForchart);
            }
        }

        //add the info to the html
        weekdayHTML.innerHTML = weekdayTable.join("");
        fiveDaysTemp.innerHTML = forecastTemp.join("");
        fiveDaysWeather.innerHTML = forecastWeather.join("");


    }

})();