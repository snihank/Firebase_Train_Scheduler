

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyA6qysGy3fjTWPnKa3-GayfSluVopqC5Yo",
    authDomain: "train-scheduler-d5aea.firebaseapp.com",
    databaseURL: "https://train-scheduler-d5aea.firebaseio.com",
    projectId: "train-scheduler-d5aea",
    storageBucket: "",
    messagingSenderId: "1061604010715"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();
  
  // 2. Button for adding train information
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#place-input").val().trim();
    var ftrainTime = $("#time-input").val().trim();
    var frequency = $("#rate-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      place: destination,
      time: ftrainTime,
      frequency: frequency
    };
  
    // Uploads train data to the database
    database.ref().push(newTrain);
  
    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.place);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    
    alert("Train Schedule successfully added");
  
    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#place-input").val("");
    $("#time-input").val("");
    $("#rate-input").val("");
  });
  
  // 3. Create Firebase event for adding train data to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot) {
    // console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var destination = childSnapshot.val().place;
    var ftrainTime = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;


    var currentTime = moment();
    var tFreq = childSnapshot.val().frequency;
    var fTrain = childSnapshot.val().time;
    var fTrainConverted = moment(fTrain, "HH:mm").subtract(1,"years");
    console.log(fTrainConverted);

    

    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    var diffTime = moment().diff(moment(fTrainConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var tRemainder = diffTime % tFreq;
    console.log(tRemainder);


    var tMinutesTillTrain = tFreq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  
    // Train Info
    console.log(trainName);
    console.log(destination);
    console.log(ftrainTime);
    console.log(frequency);
  
    
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<th>").text(trainName),
      $("<th>").text(destination),
      $("<th>").text(frequency),
      $("<th>").text(nextTrain),
      $("<th>").text(tMinutesTillTrain)
      
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);
  });
  
  