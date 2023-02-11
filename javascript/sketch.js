
// Changes Made: New Text, made sketch and page web responsive,  added animation.

let loadbar = 0;
let failedLoads = [];
let jsonDocuments = [
  "./json/veniceBitch.json",
  "./json/offRaces.json"
];

let canvas;
let files = [];
let displayText = "";

let alpha = 255;
let textY = 0;

//data structure
let phrases = []; // for cut up generator


function setup() {
  canvas = createCanvas(windowWidth/2, windowWidth/3); // canvas height scaled to width so proportion ratio is the same
  canvas.parent("sketch-container");
  canvas.mousePressed(handleCanvasPressed);

  loadFile(0);
}

function draw() {
  background(0);


  if(loadbar < jsonDocuments.length){

    fill(255);
    let barLength = width*0.5;
    let length = map(loadbar,0,jsonDocuments.length,barLength/jsonDocuments.length,barLength);
    rect(width*0.25,height*0.5,length,20);

  }else{

    let fontSize = map(displayText.length,0,windowWidth/10,40,30,true);
    textSize(fontSize);
    textWrap(WORD);
    textAlign(CENTER);

    fill(255, 200, 200, alpha);

    text(displayText, width/4, height/10 + textY, width/2);
    alpha -= 2;
    textY += 3

  }

}

function handleCanvasPressed(){
  //original text
  displayText = "Don't show this boring sentence, generate some text instead!";

  //generate cut up phrases
  displayText = generateCutUpPhrases(floor(random(2, 5)));


  //show text in HTML
  showText(displayText);
  console.log(displayText);
  alpha = 255;
  textY = 0;

}

function buildModel(){
  console.log("run buildModel()");

  //phrases
  for(let i = 0; i < files.length; i++){

    let textPhrases = files[i].text.split(/(?=[,.])/);
 
    for(let j = 0; j < textPhrases.length; j++){
      let phrase = textPhrases[j];
      let punctuationless = phrase.replace(/[^a-zA-Z- ']/g,"");//everything except letters, whitespace & '
      let lowerCase = punctuationless.toUpperCase();
      let trimmed = lowerCase.trim();
  
      phrases.push(trimmed);
    }

  }

}

//Text Generator Functions ----------------------------------

function generateCutUpPhrases(numPhrases){
  let output = "";

  //implement your code to generate the output
  for(let i = 0; i < numPhrases; i++){

    let randomIndex = int(random(0,phrases.length));
    let randomPhrase = phrases[randomIndex];

    output += randomPhrase + " ";

  }


  return output;
}


//Generic Helper functions ----------------------------------

function loadFile(index){

  if(index < jsonDocuments.length){
    let path = jsonDocuments[index]; 

    fetch(path).then(function(response) {
      return response.json();
    }).then(function(data) {
    
      console.log(data);
      files.push(data);

      showText("Training text number " + (index+1));
      showText(data.text);
  
      loadbar ++;
      loadFile(index+1);
  
    }).catch(function(err) {
      console.log(`Something went wrong: ${err}`);
  
      let failed = jsonDocuments.splice(index,1);
      console.log(`Something went wrong with: ${failed}`);
      failedLoads.push(failed);// keep track of what failed
      loadFile(index); // we do not increase by 1 because we spliced the failed one out of our array

    });
  }else{
    buildModel();//change this to whatever function you want to call on successful load of all texts
  }

}

//add text as html element
function showText(text){

  let textContainer = select("#text-container");

  let p = createP(text);
  p.parent("text-container");

}

function windowResized() {

  if(windowWidth < 800){
    resizeCanvas(windowWidth, windowWidth/2);
  }else if(canvas.width != 800){
    resizeCanvas(windowWidth/2, windowWidth/2);
  }
}