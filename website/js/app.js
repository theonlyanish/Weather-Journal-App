// Custom Current Date

let d = new Date();

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

let month = months[d.getMonth()]; // current month
let currentDate = `${d.getDate()} ${month} ${d.getFullYear()}`; // custom current date


// Custom Current Time Format

let currentTime = d.toLocaleTimeString();


// Footer: Current Year

document.querySelector('.year').innerHTML = d.getFullYear();


// Generate Button: Activation Via Enter to Click Event

let locInput = document.querySelector('#location');
let generateButton = document.querySelector('#generate')

locInput.addEventListener('keyup', (event) => {

    if (event.keyCode === 13) {
        event.preventDefault();
        generateButton.click();
    }

});


// Generate Button: Activation Via Click Event

generateButton.addEventListener('click', (event) => {

    let location = document.querySelector('#location').value;
    let feel = document.querySelector('input[type="radio"]:checked').value;


    fetch ('/all-data', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({location,feel}) // Convert the input data of zip and feeling into a string for server
    })

    .then (res => {
        return res.json()
    })

    .then (data => {

        // Validation - Location Input

        if (data.locValidation != null) {
            alert(data.locValidation);
            return;
        } else {
            updateUI();
        }
    })

});


/* Dynamic UI */

const updateUI = async () => {

    const request = await fetch('/project-data');
    
    try {

        const allData = await request.json();


        // Form Output Block

        document.querySelector('.journal').style.display = 'block';


        // Data Output

        document.querySelector('#date').innerHTML = `${currentDate} | ${currentTime}`;
        document.querySelector('.location').innerHTML = `${allData[0].loc}, ${allData[0].countryCode} (coord: ${allData[0].lat}, ${allData[0].lon})`;
        document.querySelector('#temp').innerHTML = `${allData[0].temp.toFixed(1)} °C`;
        document.querySelector('.cloud-percentage').innerHTML = `${allData[0].cloudPercent}% | `;
        document.querySelector('.cloud-status').innerHTML = `${allData[0].cloudStatus}`;
        document.querySelector('.wind').innerHTML = `${allData[0].wind} m/s (wind speed)`;
        document.querySelector('.visibility').innerHTML = `${allData[0].visibility / 1000} km`;
        document.querySelector('.humidity').innerHTML = `${allData[0].humidity}% (humidity)`;
        document.querySelector('#content').innerHTML = `I am feeling ${allData[0].feeling} today.`;


        // Close Button

        if (window.screen.width < 981) {
            document.querySelector('.close-button').style.visibility = 'visible';
            document.querySelector('.close-button').style.opacity = '1';
        } else {
            document.querySelector('.close-button').style.visibility = 'hidden';
            document.querySelector('.close-button').style.opacity = '0';
        }

    }

    catch(error) {
        console.log('*** Error on Dynamic UI. ***', error);
    }

};


function closeButton() {

    const journal = document.querySelector('.journal');
    const closeButton = document.querySelector('.close-button');

    journal.style.display = 'none';
    closeButton.style.visibility = 'hidden';
    closeButton.style.opacity = '0';

}