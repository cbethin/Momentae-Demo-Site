console.log("Connected.")
var pieChart = null;
var progressBar = null;

function startProgressBar() {
    progressBar.value = 0;
    var interval = setInterval(() => {
        progressBar.value += 0.001;
        console.log("Prog Bar --", progressBar.value)
        if (progressBar.value == 1.0) {
            clearInterval(interval);
            setTimeout(() => {
                progressBar.value = 0;
            }, 500);
        }
    }, 10);
}

var DeepRation = {}
DeepRation.symptoms = [ 
        "Restaurants", "Food / Cooking", "Home", "Casual Interaction", "Departing the home", 
        "Bodily Injury", "Physicality", "Contemplation", "Family", "Communication", "Neutral / Details",  
        "Financials / Transactions", "Optimism", "Time-related words", "Analysis / Pensive Thought", 
        "Less Than Positive Interactions", "Work", "Interpersonal Depression / Isolation", "School -- more general" , 
        "Romantic Descriptors and Interactions", "Friendship and Interactions", "Swear Words", 
        "Negative Peer Social Interactions / Social Anxiety", "Negative Emotions", "Anxiety", "Suicide" , "Entertainment", 
        "Clinical Mental Health / Intervention", "College", "Social Media / Internet Terms"
    ]
DeepRation.realSymptoms = ["Analysis / Pensive Thought", "Interpersonal Depression / Isolation", "Anxiety", "Suicide",
        "Negative Peer Social Interactions / Social Anxiety", "Negative Emotions", "Optimism" ]

DeepRation.colors = getColors(DeepRation.symptoms.length)

DeepRation.modifySymptoms = (scores) => {
    var outputData = []
    var outputLabels = []
    var outputColors = []
    var finalVal = 0.0

    for (i in scores) {
        if (DeepRation.realSymptoms.includes(DeepRation.symptoms[i])) {
            outputData.push(scores[i]);
            outputLabels.push(DeepRation.symptoms[i]);
            outputColors.push(DeepRation.colors[i]);
        } else {
            finalVal += scores[i];
        }
    }

    outputData.push(finalVal);
    outputLabels.push("Not Symptomatic");
    outputColors.push("rgba(56,78,89,0.4)");

    return { scores: outputData, labels: outputLabels, colors: outputColors }
}

function handleNewScores(data) {
    if (!data) { return; }
    if (!data.hasOwnProperty('scores')) { return; }

    loadCharts(data['scores'])
}

function getColors(n) {
    var colors = []
    for (var i = 0; i < n; i++) {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        colors.push("rgb(" + r + "," + g + "," + b + ")");
    }
    return colors;
}

function loadCharts(scores) {
    if (!scores) { 
        scores = [ 0.02976190476190475, 0.03174603174603174, 0.02976190476190475, 0.02976190476190475, 
            0.02976190476190475, 0.051587301587301584, 0.02976190476190475, 0.037698412698412696, 0.02976190476190475, 
            0.051587301587301584, 0.035714285714285705, 0.03174603174603174, 0.03174603174603174, 0.035714285714285705, 
            0.04365079365079365, 0.02976190476190475, 0.02976190476190475, 0.02976190476190475, 0.03373015873015872, 
            0.02976190476190475, 0.03174603174603174, 0.02976190476190475, 0.03373015873015872, 0.03174603174603174, 
            0.02976190476190475, 0.02976190476190475, 0.02976190476190475, 0.037698412698412696, 0.03373015873015872, 
            0.02976190476190475 ] 
    }

    var data = DeepRation.modifySymptoms(scores)

    var ctx = document.getElementById('chart').getContext('2d');
    ctx.backgroundColor = '#1e1e1e';

    if (pieChart) { pieChart.destroy(); }
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{ 
                data: data.scores,
                // backgroundColor: ['#F24954', '#00D889', '#00A9F8', '#A872FF'],
                backgroundColor: data.colors,
                borderWidth: 0
            }],
            
        },
        options: {
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: true
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document ready.")

    progressBar = document.querySelector('progress');
    progressBar.value = 0.0;

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
                progressBar.value = 1.0
            }
        });
        startProgressBar();
    });
})