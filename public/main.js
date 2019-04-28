console.log("Connected.")

var symptoms = ['Symptom 1', 'Symptom 2', 'Symptom 3', 'Symptom 4']

function handleNewScores(data) {
    if (!data) { return; }
    if (!data.hasOwnProperty('scores')) { return; }
    loadCharts(data['scores'])
}

function loadCharts(scores) {
    if (!scores) { scores = [1, 1.5, 1, 1] }
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: symptoms,
            datasets: [{ 
                data: scores,
                backgroundColor: ['#DA6060', '#00D18C', '#3BA9F2', '#9C7FFC'],
                borderWidth: 0
            }],
            
        },
        options: {
            legend: {
                display: false
            },
            responsive: false,
            maintainAspectRatio: true
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document ready.")

    loadCharts();

    var submitButton = document.querySelector('.submit');
    var textBox = document.querySelector('textarea');

    submitButton.addEventListener('click', () => {
        console.log(`Button clicked. ${textBox.value}`)
        $.ajax({
            type: "POST",
            url: '/api/getTopicScores',
            data: JSON.stringify({"text": textBox.value}),
            contentType: 'application/json',
            success: (data, success, xhttp) => {
                jsonData = JSON.parse(JSON.stringify(data))
                handleNewScores(jsonData)
            }
        })
    });
})