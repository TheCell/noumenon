// socket stuff
let ip = "192.168.0.102"; // laura's ip-adresse

var socket = io(ip + ':3000'); //IP-Adresse WLAN
socket.on('connect', function () {
  console.log("connected");
});
socket.on('event', function (data) {
  console.log("event triggered");
});
socket.on('disconnect', function () {
  console.log("disconnected");
});

//progress-bar shizzl
let getProgressbar = document.getElementsByClassName("progressBar");
let progressBar = getProgressbar[0];
window.progressWidth = 0;

let getBarContainer = document.getElementsByClassName("barContainer");
let barContainer = getBarContainer[0];

//get counter for 
function startCounter() {
counter = 0;

setInterval(function() {
  counter = counter + 1;

  if (counter > 180) {
    reset();
  }
}, 1000);
}

//  questionSwitch
let questionSwitch = [];

for (let i = 0; i < 15; i++) {
  let questionString = "questionBox" + (i + 1);
  let obj = document.getElementById(questionString);
  questionSwitch.push(obj);
}

questionSwitch.forEach(function (questionBox, index, arr) {
  let possibleButtons = [];
  possibleButtons = possibleButtons.concat([].slice.call(questionBox.getElementsByClassName("circle")));
  possibleButtons = possibleButtons.concat([].slice.call(questionBox.getElementsByClassName("choiceImage")));
  possibleButtons = possibleButtons.concat([].slice.call(questionBox.getElementsByClassName("choiceAnswer")));

  possibleButtons.forEach(function (button, buttonArrIndex) {
    if (index < arr.length) {
      button.addEventListener("click", function () {
        setTimeout(function () {
          arr[index].style.display = "none";
          arr[index + 1].style.display = "block";

          //progress-bar
          let progressPercentPerQ = 100 / (questionSwitch.length - 1);
          window.progressWidth = window.progressWidth + progressPercentPerQ;
          progressBar.style.width = window.progressWidth + '%'; 

          //counter auf 0 setzen wenn button geklickt
          console.log(counter);
          counter = 0;
          
          //remove resetButton  and progressBar if questionBox15 is displayed
          if (questionSwitch[14].style.display == 'block') {
            resetButton.style.display = "none";
            barContainer.style.display = "none";
          }
        }, 500);

      });
    }
  });
});

//function for reset-button – wird aufgerufen in HTML!!
function reset() {
  socket.emit('answers', -1);
  location.reload()
}

//reload all content
document.addEventListener("DOMContentLoaded", function () {
  socket.emit('answers', 0);
});


//start-button on homescreen
document.getElementById("start").addEventListener("click", function () {
  setTimeout(function () {
    startCounter();
    socket.emit('answers', 0);
    questionBox1.style.display = "block";
    homescreen.style.display = "none";
    resetButton.style.display = "flex";

    //progressBar display
    barContainer.style.display = "flex";
    window.progressWidth = 0;
    progressBar.style.width = window.progressWidth + '%';
    resetCSS();
  }, 500);
  start.className = "button activeButton";
})

//remove all added classes from elements for active
function resetCSS() {
  var active = [
    'activeImage',
    'activeCircle',
    'activeAnswer',
    'activeButton',
    'activeEnd'
  ]

  for (let selector of active) {
    let elements = document.getElementsByClassName(selector)
    for (let element of elements) {
      element.classList.remove(selector)
    }
  }
}

//restart-button on last page
document.getElementById("backto").addEventListener("click", function () {
  setTimeout(function () {
    socket.emit('answers', -1);
    homescreen.style.display = "block";
    questionBox15.style.display = "none";
    resetCSS();
  }, 500);
  backto.className = "endButton activeEnd";
})

//print-button switch to screen active print
document.getElementById("drucken").addEventListener("click", function () {
  setTimeout(function () {
    socket.emit('answers', -2);
    questionBox15.style.display = "none";
    printBox.style.display = "block";
    resetButton.style.display = "none";
    resetCSS();
  }, 500);
  drucken.className = "printButton activeEnd";

  //go back to homescreen after printing
  setTimeout(backToStart, 70 * 1000);
})

//back to start from print-window
function backToStart() {
  socket.emit('answers', -1);
  printBox.style.display = "none";
  homescreen.style.display = "block";
}