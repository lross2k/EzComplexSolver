var CurrentN = 0;
const legalChrs = ['+','-','i','j',',','.'];

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

function CoolParse( id ) {
    let str = document.getElementById( id ).value, clstr = '';
    if (str == '') { return math.complex(0,0); }
    for (var i = 0; i < str.length; i++) {
        if ( isNumeric(str[i]) || ( legalChrs.indexOf(str[i]) >= 0 ) ) {
            clstr += str[i];
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

function prntResult(result) {
    let str = '';
    for (var i = 0; i < CurrentN; i++) { str += 'x' + (i+1) + ': ' + result[i] + '<br>'; }
    document.getElementById("answer").innerHTML = str;
}

export function MyJSX(n) {
    if (n == CurrentN){return;}
    let str = '';
    for (let i = 0; i < n; i++) {
        str += '<div id="matrix-row">';
        for (let j = 0; j < n; j++) {
            str += '<input id="A' + (i+1) + (j+1) + '" placeholder="A' + (i+1) + (j+1) + '">';
        }
        str += '<input id="x" placeholder="x' + (i+1) + '" disabled>' +
        '<input id="b' + (i+1) + '" placeholder="b' + (i+1) + '"></div>';
    }
    document.getElementById("matrix").innerHTML = str;
    CurrentN = n;
}
//</div><div id="equal-row">
export function Solve() {
    let A = [], b = [];
    for (var i = 0; i < CurrentN; i++) { A.push( [] ); }
    for (var i = 0; i < CurrentN; i++) {
        for (var j = 0; j < CurrentN; j++) {
            A[i].push( CoolParse( 'A' + (i+1) + (j+1) ) );
        }
        b.push( CoolParse( 'b' + (i+1) ) );
    }
    prntResult(math.lusolve(A, b));
}