//line chart drawn with the temperature values of the next 5 days
export function lineChart (labels, array) {
        let myChart = new Chart(chart, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: "Temp",
                    data: array,
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