/**
 * Used modules because I intended to split the functions in diferent files
 * Now I know this won't work on IE so I haven't decided if I care enough to not do that
 */
import {solver, matrixBuilder} from "./button.js";

// Build a default A (2x2) matrix because I have been too lazy to manually place it in the index (I ain't kidding)
matrixBuilder(2);

// Declaring variables to the buttons
let btnSolve = document.querySelector('#solve');
let btnUpdate = document.querySelector('#update');

// Adding an event listener to those buttons
btnSolve.addEventListener('click', () => solver());
btnUpdate.addEventListener('click', () => matrixBuilder( document.getElementById("level").value ));