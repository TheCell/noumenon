// socket stuff
let ip = "10.155.115.138"; // laura's ip-adresse

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

          let progressPercentPerQ = 100 / (questionSwitch.length - 1);
          window.progressWidth = window.progressWidth + progressPercentPerQ;
          progressBar.style.width = window.progressWidth + '%'; 

          //remove resetButton if questionBox15 is displayed
          if (questionSwitch[14].style.display == 'block') {
            resetButton.style.display = "none";

            //timeout nach 5 minuten einbauen hier
            //var für counter, wenn geklickt counter auf 0 setzen
            //timeout wenn 5 minuten vorbei, zurück zu start (function reset ausführen)

            //remove resetBar
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

  //go back to homescreen after 30 seconds
  setTimeout(backToStart, 10 * 1000);
})

//back to start from print-window
function backToStart() {
  socket.emit('answers', -1);
  printBox.style.display = "none";
  homescreen.style.display = "block";
}