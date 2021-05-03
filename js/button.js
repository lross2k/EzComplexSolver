// Global variables which I have been to lazy to manage correctly
var CurrentN = 0;
const legalChrs = ['+','-','i','j',',','.'];

// Takes a string and returns True if the string is a number
function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

/**
 * This is a temporary solution!!!!
 * Takes the id of an <input> element and analizes the value to clean the format
 * Removes all non-legal characters, could be ' ', 'a', 'd', etc...
 * Returns a math.complex() from the math.js library
 */
function weirdParser( id ) {
    // I'd comment more on this, but I plan on rewriting this whole thing with regex
    let str = document.getElementById( id ).value, clstr = '';
    if (str == '') { 
        document.getElementById(id).value = 0;
        return math.complex(0,0);
    }
    for (var i = 0; i < str.length; i++) {
        if ( isNumeric(str[i]) || ( legalChrs.indexOf(str[i]) >= 0 ) ) {
            clstr += str[i];
        } else {
            document.getElementById("ans-wrap").style.backgroundColor = "#FFCC33";
            document.getElementById("error").innerText = "Precaución! Carácteres indeseados fueron detectados";
            document.getElementById("ans-wrap").style.backgroundColor = "#FFCC33";
        }
    }
    str = clstr;
    let fstr = '', sstr = '';
    fstr += str[0];
    for (var i = 1; i < str.length; i++) {
        if ( str[i] != '+' && str[i] != '-' ) {
            fstr += str[i] != ',' ? str[i] : '.';
        } else {
            sstr = fstr;
            fstr = '';
            fstr += str[i];
        }
    }
    let answer
    if ( sstr.charAt(sstr.length-1) == 'i' || sstr.charAt(sstr.length-1) == 'j' ) {
        if ( fstr.charAt(fstr.length-1) != 'i' && fstr.charAt(fstr.length-1) != 'j' ) {
            answer = math.complex( parseFloat(fstr), parseFloat(sstr) );
        } else {
            return 'error';
        }
    } else if (fstr.charAt(fstr.length-1) == 'i' || fstr.charAt(fstr.length-1) == 'j') {
        sstr = sstr != '' ? sstr : 0;
        answer = math.complex( parseFloat(sstr), parseFloat(fstr) );
    } else if ( isNumeric(fstr) && isNumeric(sstr)) {
        answer = math.complex( parseFloat(sstr), parseFloat(fstr) );
    } else {
        fstr = isNumeric(fstr) ? fstr : 0;
        sstr = isNumeric(sstr) ? fstr : 0;
        answer = math.complex( parseFloat(fstr), parseFloat(sstr) );
    }
    return answer;
}

// Inserts the result in the index.html using .innerHTML
function prntResult(result) {
    let str = '';
    let pol = '';
    for (var i = 0; i < CurrentN; i++) { str += 'x' + (i+1) + ': ' + result[i] + '<br>'; }

    for (var i = 0; i < CurrentN; i++) {
        if (result[i][0] != 0) {
            pol += 'x' + (i+1) + ': ' + math.sqrt((result[i][0].re)**2 + (result[i][0].im)**2) + '<br>';
        } else {
            pol += 'x' + (i+1) + ': ' + 0 + '<br>';
        }
    }

    document.getElementById("answer").innerHTML = str;
    document.getElementById("ans-pol").innerHTML = pol;
}

// Builds a matrix HTML for any given size n for the A matrix of order nxn
export function matrixBuilder(n) {
    if (n == CurrentN){return;}
    let str = '';
    for (let i = 0; i < n; i++) {
        str += '<div id="matrix-row">';
        for (let j = 0; j < n; j++) {
            str += '<input class="input-num" id="A' + (i+1) + (j+1) + '" placeholder="A' + (i+1) + (j+1) + '">';
        }
        str += '<input class="x-num" placeholder="x' + (i+1) + '" disabled>' +
        '<input class="input-num" id="b' + (i+1) + '" placeholder="b' + (i+1) + '"></div>';
    }
    document.getElementById("matrix").innerHTML = str;
    CurrentN = n;
}

// Solves the matrix taking it's values, calling the parser and using math.lusolve() from math.js
export function solver() {
    document.getElementById("ans-wrap").style.backgroundColor = "#0066CC";
    document.getElementById("error").innerText = "";
    let A = [], b = [], parsed = '';
    for (var i = 0; i < CurrentN; i++) { A.push( [] ); }
    for (var i = 0; i < CurrentN; i++) {
        for (var j = 0; j < CurrentN; j++) {
            parsed = weirdParser( 'A' + (i+1) + (j+1) );
            if (parsed == 'error') {
                document.getElementById("ans-wrap").style.backgroundColor = "#990000";
                document.getElementById("error").innerText = "Error por números complejos, casilla: " + 'A' + (i+1) + (j+1);
                //document.getElementById( 'A' + (i+1) + (j+1) ).style.backgroundColor = "#990000"; // Mark the error in red // WIP
                document.getElementById("answer").innerText = "No se pudo calcular";
                return;
            }
            A[i].push( parsed );
        }
        parsed = weirdParser( 'b' + (i+1) );
        if (parsed == 'error') {
            document.getElementById("ans-wrap").style.backgroundColor = "#990000";
            document.getElementById("error").innerText = "Error por números complejos, casilla: " + 'b' + (i+1);
            document.getElementById("answer").innerText = "No se pudo calcular";
            return;
        }
        b.push( parsed );
    }
    prntResult(math.lusolve(A, b));
}