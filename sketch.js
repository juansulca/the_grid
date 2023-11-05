/**
 *  Authored By: Juan Sulca, Zubin Isaac, Rutooja Khamkar, Thomas
 *  Sound recorder sketch for Experiment 2
 *  Based on https://editor.p5js.org/zara__s/sketches/ZUNqgd-WT
 *  And https://p5js.org/reference/#/p5.FFT
 *  And https://editor.p5js.org/rios/sketches/IazTFSKSt
 *  And Chat GPT for the random line generation.
**/

const threshold = 12;

let soundLoop;
let synth;
let osc;
let note;
let soundLoopIntervalSec;
let started = false;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  userStartAudio();

  synth = new p5.MonoSynth();

  note = getNote();

  soundLoopIntervalSec = getRandomLoopInterval();
  console.log(soundLoopIntervalSec);
  soundLoop = setupSoundLoop(note, soundLoopIntervalSec);

  // const playButton = createButton("play");
  // playButton.position(40, 0);

  cnv.mouseClicked(() => {
    if (!started) {
      synth.play(note, 1, 0, 1);
      soundLoop.start();
      started = true;
    }
  });

  mic = new p5.AudioIn();

  mic.start();

  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw() {
  let spectrum = fft.analyze();

  const y = fft.getEnergy("mid", "midHigh");
  const mappedValue = map(y, 0, 60, 0, 255);
  background(mappedValue);
  // showMicLevel(y);

  if (y > threshold) {
    drawRandomLine();
  }
  // printDebugText()
}

/**
 * Pick a random tone from the the combination of a note and an octave
 * @returns {string}
**/
function getNote() {
  const note = random(["E", "G", "A", "B", "D"]);
  const oct = random([4, 5, 6]);
  return `${note}${oct}`;
}

/**
 * Pick a random loop interval in seconds
 * @returns {string} interval in seconds
**/
function getRandomLoopInterval() {
  const r = random(0, 100);
  if (r > 90) return 4;
  if (r > 70) return 6;
  if (r > 40) return 8;

  return 16;
}

/**
 * Setup a sound loop using the given note and an interval in seconds
 * @param {string} note
 * @param {number} interval
 * @returns {p5.SoundLoop}
**/
function setupSoundLoop(note, interval) {
  return new p5.SoundLoop((timeFromNow) => {
    synth.play(note, 1, timeFromNow, 1);
  }, interval);
}

/**
 * Draw a random lenght line inside the canvas
 *
**/
function drawRandomLine() {
  stroke(121, 255, 123);
  const weight = random(0.1, 2);
  strokeWeight(weight);

  const x1 = random(width);
  const y1 = random(height);
  const x2 = x1 + random(-width - 100, width + 100);
  const y2 = y1 + random(-height - 100, height + 100);
  line(x1, y1, x2, y2);
}

/**
 * Print the note and interval lenght to the screen
 *
**/
function printDebugText() {
  strokeWeight(1);
  fill(121, 255, 123);
  stroke(121, 255, 123);
  text(note, 10, 20);
  text(soundLoopIntervalSec, 10, 40);
}

/**
 * Print the mic level to the screen
 *
**/
function showMicLevel(y) {
  noFill();
  strokeWeight(1);
  stroke(121, 255, 123);
  text(`Mic Level: ${round(y)}`, 10, 50);
}
