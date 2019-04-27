console.log("Connected.")

function handleNewScores(data) {
    if (!data) { return; }
    if (!data.hasOwnProperty('scores')) { return; }

}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Document ready.")

    var submitButton = document.querySelector('.submit');
    var textBox = document.querySelector('textarea');

    submitButton.addEventListener('click', () => {
        console.log(`Button clicked. ${textBox.value}`)
        $.ajax({
            type: "POST",
            url: 'https://dr.charlesbethin.com/api/getTopicScores',
            data: JSON.stringify({"text": textBox.value}),
            contentType: 'application/json',
            success: (data, success, xhttp) => {
                jsonData = $.parseJSON(data)
                handleNewScores(jsonData)
            }
        })
    });
})