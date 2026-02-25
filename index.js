//Random quotes api
const quoteApiUrl = "https://api.api-ninjas.com/v2/randomquotes?categories=success,wisdom";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Display random quotes
const renderNewQuote = async () => {
    try {
        const response = await fetch(quoteApiUrl, {
            headers: { 'X-Api-Key': 'wvSiUWyTc9P6uTW513G2yODDMJhEQ3Ew6wsjEapq' }
        });
        if (!response.ok) throw new Error("Network response was not ok");
        let data = await response.json();
        quote = data[0].quote; // API Ninjas returns an array of quotes

        quoteSection.innerHTML = "";
        let arr = quote.split("").map((value) => {
            return "<span class='quote-chars'>" + value + "</span>";
        });
        quoteSection.innerHTML = arr.join("");
    } catch (error) {
        console.error("Error fetching quote:", error);
        quoteSection.innerHTML = "Could not load quote. Please try again.";
    }
};
//Logic to compare input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    quoteChars = Array.from(quoteChars);

    //Array of user input chars
    let userInputChars = userInput.value.split("");
    //Loop through each char in quote
    quoteChars.forEach((char, index) => {
        //Check chars with quote chars
        if (char.innerText == userInputChars[index]) {
            char.classList.add("success");
        }
        //If user hasn't entered anything or backspaced
        else if (userInputChars[index] == null) {
            if (char.classList.contains("success")) {
                char.classList.remove("success");
            } else {
                char.classList.remove("fail");
            }
        }
        //if user entered wrong char
        else {
            if (!char.classList.contains("fail")) {
                //increament and displaying mistakes
                mistakes++;
                char.classList.add("fail");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        //Return true if all chars are correct
        let check = quoteChars.every((element) => {
            return element.classList.contains("success");
        });

        //End test if all chars are correct
        if (check) {
            displayResult();
        }

    });

});

//Update timer
function updateTimer() {
    if (time == 0) {
        //End test if reaches 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

//Set timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

//End test
const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;

    let timeTaken = (60 - time) / 60; // fraction of a minute
    if (timeTaken <= 0) timeTaken = 1 / 60; // prevent divide by zero

    let wpm = (userInput.value.length / 5 / timeTaken).toFixed(2);
    document.getElementById("wpm").innerText = wpm + " wpm";

    let accuracy = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100);
    document.getElementById("accuracy").innerText = accuracy + "%";
};

//Start test
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}