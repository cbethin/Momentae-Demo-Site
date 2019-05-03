console.log("Connected.")
var pieChart = null;
var progressBar = null;

function startProgressBar() {
    progressBar.value = 0;
    var interval = setInterval(() => {
        progressBar.value += 0.001;
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
        "Partying", "School Social Interactions", "Existenialism", "Work", "Home", "Restaurants", "Bodily Injury", "Swear Words",
        "Negative Intimate Interactions", "Severe Depression", "Examining Relationships", "Anxiety", "Family", "Social Media / Internet Terms",
        "Time (Descriptors", "Reflection", "Financials/Transactions", "Time (Duration)", "College", "Food/Cooking", "Neutral/Details",
        "Clinica Mental Health / Intervention", "Less than Positive Interactions", "Romantic Descriptors & Interactions",
        "Departing the Home", "Communication", "Casual Interaction", "Logical Discovery", "Negative Emotions", 
        "Physical Symptoms of Depression"
    ]
DeepRation.realSymptoms = ["Bodily Injury", "Existentialism", "Examining Relationships", "Negative Intimate Interactions",
        "School Social Interactions", "Less than Positive Interactions", "Negative Emotions", 
        "Clinical Mental Health / Intervention", "Physical Symptoms of Depression", "Severe Depression", "Swear Words", "Anxiety"
    ]
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
        }
    }

    var sumOfVals = outputData.reduce((sum, x) => sum + x);
    console.log("Sum of Vals:", sumOfVals);
    var finalVal = 1 - sumOfVals

    outputData.push(finalVal);
    outputLabels.push("Not Symptomatic");
    outputColors.push("rgba(56,78,89,0.4)");

    return { scores: outputData, labels: outputLabels, colors: outputColors }
}
DeepRation.getMaxSymptoms = (scores) => {
    for (var i=0; i < scores.length; i++) {
        
    }

}
DeepRation.samples = [
    "It's getting harder and harder each day to keep thinking of reasons to continue going on. I exercise regularly. I have enough friends that I love. I'm doing okay financially. I have hobbies to keep me distracted. But I can't get rid of this feeling of emptiness, loneliness that just doesn't want to let me go and just let me be a normal person. I don't want to keep trying to live this miserable life and I feel so fucking weak for believing as such",
    "I am a college student, and have been feeling depressed for the past year and a half. I have tried therapy twice, and while it makes me feel a little bit better, I continue to sink back into a state of feeling sad and hopeless all of the time. I used to be motivated and have friends in high school, but since going to college I have had difficulty making friends, and feel somewhat hopeless about the future of my social life, and am overall experiencing a constant state of intense sadness. I am wondering if anyone who has taken anti-depressants has felt like they were able to get back to their \"old self\" prior to depression, and if taking meds has made them feel more comfortable in social situations. I have scheduled an upcoming appointment with a psychiatrist to discuss the possibility of taking medications.",
    "So long story short I'm in my early 30's and can find no reason to do anything. Was engaged and me and my fiance had a couple  miscarriages. After multiple fights and our second miscarriage my fiance committed suicide. Since then (3 years) I struggle to find the point in anything.Has anyone else suffered the same way and if so how did you move on",
    "The storm came in today. There was no rain outside. No wind, no thunder or lightning. The storm was not in the sky. One mistake can cause my storm. A storm of self loathing and hopelessness. Wondering why I bother getting out of bed. Good things never last. And they don't come very often. But I felt differently yesterday. My euphoric happiness clouded my judgement. My favourite feeling made me lose focus. And I left the floodgates openNow the storm moves freely within. It'll go, but will come back again"
]

function handleNewScores(data) {
    if (!data) { return; }
    if (!data.hasOwnProperty('scores')) { return; }

    let scores = data['scores'];
    for (var i in scores) {
        if (scores[i] < 0.03333333333333334) {
            scores[i] = 0.0
        }
    }
    
    setSymptomList(data['scores']);
    loadCharts(data['scores']);
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
function setSymptomList(scores) {
    if (!scores) {
        document.querySelector('#symptom-list').innerHTML = "<li>No Symptoms Found</li>"
        return;
    }

    var data = DeepRation.modifySymptoms(scores);
    var symptomList = document.querySelector('#symptom-list');
    var htmlString = "";

    for (var i in data['scores']) {
        if (data['scores'][i] > 0 && data['labels'][i] != "Not Symptomatic") {
            htmlString += "<li id=\"" + data['labels'][i] + "\" style=\" color: " + data['colors'][i] + "\">" + data['labels'][i] + "</li>";
        }
    }

    if (htmlString == "") { htmlString = "<li>No Symptoms Found</li>"}
    symptomList.innerHTML = htmlString;
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

// SLIDER
function beginAnimation() {
    var i = 0;
    var facts = [
        '40% of all students with depression will not get treatment.', 
        '1 in 4 people aged 18-24 have a diagnosable mental illness.',
        '30% have felt so depressed at one point they found it difficult to function.'
    ]
    var scrollers = $('.scrolling-text h6');
    scrollers[0].innerText = facts[0];
    scrollers[1].innerText = facts[1];
    return setInterval(() => {
        i++;
        $('.scrolling-text')[0].innerHTML += "<h6>" + facts[i % facts.length] + "</h6>"
        $('.scrolling-text h6')[0].remove();
        $('.scrolling-text h6').css('right', '0vw');
        $('.scrolling-text h6').animate({
            right: '100vw'
        }, {
            duration: 5000,
            ease: 'linear',
        })
    }, 8500);
}

function setupSampleButtons() {
    var sampleList = $('.samples')[0]

    var htmlString = ""
    for (var i in DeepRation.samples) {
        htmlString += "<a class=\"sample-items\" data-text=\"" + DeepRation.samples[i] + "\"> Sample " + String(Number(i)+1) + "</a>"
    }

    sampleList.innerHTML = htmlString
    
    $('.sample-items').click((e) => {
        $('textarea')[0].value = e.target.dataset.text;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document ready.")
    beginAnimation();
    setupSampleButtons();
    
    progressBar = document.querySelector('progress');
    progressBar.value = 0.0;

    setSymptomList();
    loadCharts(new Array(30).fill(1));

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

    $('textarea').keyup((e) => {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            $('.submit').click();
        }
    });
})