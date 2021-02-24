export function forecastFivedays () {
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