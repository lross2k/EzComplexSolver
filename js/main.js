import {fn1, complex} from "./button.js";

//python -m http.server

let btnSecondary = document.querySelector('#secondary');
let btnPrimary = document.querySelector('#primary');

btnPrimary.addEventListener('click', () => complex())
btnSecondary.addEventListener('click', () => fn1())