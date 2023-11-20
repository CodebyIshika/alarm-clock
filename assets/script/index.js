'use strict';

import { onEvent, select } from "./utils.js";

// Selections
const currentTime = select('.time');
const setAlarm = select('.feedback');
const hours = select('.hours');
const minutes = select('.minutes');
const button = select('.button');

const alarmAudio = new Audio('./assets/media/alarm-sound.wav');

// Main code

// Getting the current time
function getCurrentTime() {
    const now = new Date();

    const currentHours = now.getHours().toString().padStart(2, '0');
    const currentMinutes = now.getMinutes().toString().padStart(2, '0');

    currentTime.innerText = `${currentHours}:${currentMinutes}`;
}

// Updating current time every second
setInterval(getCurrentTime, 1000);

// Input validation
function validateInput() {
    const inputHours = hours.value.trim();
    const inputMinutes = minutes.value.trim();

    if (!(inputHours >= 0 && inputHours <= 23) || inputHours.length !== 2) {
        handleInvalidInput(hours);
    }
    if (!(inputMinutes >= 0 && inputMinutes <= 59) || inputMinutes.length !== 2) {
        handleInvalidInput(minutes);
    }

    if (inputHours.length === 2 && inputMinutes.length === 2) {
        handleValidInput(inputHours, inputMinutes);
    }
}

function handleValidInput(hours, minutes) {
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        setAlarm.innerText = `${hours}:${minutes}`;
        setAlarmTime(hours, minutes);
    }
}

function handleInvalidInput(inputElement) {
    inputElement.style.border = '1px solid red';
    setTimeout(() => {
        inputElement.style.border = 'none';
        setAlarm.innerText = '';
    }, 500);
}

function setAlarmTime(hours, minutes) {
    const now = new Date();
    const alarmTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes,
        0,
        0
    );

    const timeDifference = alarmTime - now;

    if (timeDifference > 0) {
        setTimeout(() => {
            alarmAudio.play();
        }, timeDifference);
    }
    if (timeDifference <= 0) {
        alarmTime.setDate(now.getDate() + 1);
    }
}

// Event listener
onEvent('click', button, (event) => {
    event.preventDefault();
    validateInput();
    hours.value = '';
    minutes.value = '';
});