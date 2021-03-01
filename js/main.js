import {Solve, MyJSX} from "./button.js";

MyJSX(2);

let btnSolve = document.querySelector('#solve');
let btnUpdate = document.querySelector('#update');

btnSolve.addEventListener('click', () => Solve());
btnUpdate.addEventListener('click', () => MyJSX( document.getElementById("level").value ));