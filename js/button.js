var CurrentN = 0;
const Letters = ['x', 'y', 'z', 'i', 'j', 'k'];
const legalChrs = ['+','-','i','j',',','.'];

// TODO better parser
function get_complex(id) {
    var str = document.getElementById( id ).value;

    if ( isNumeric(str) ) {
        return math.complex(str, 0);;
    }

    if (str.includes("+", 0)) {
        var arr = str.split('+');
    } else if (str.includes("-", 0)) {
        var arr = str.split('-');
    }
    if (arr[0] == "") {
        return [0,0];
    }
    var fixed = "";
    for (var i = 0; i < arr[1].length ; i++) {
        if (arr[1][i] == 'j' || arr[1][i] == 'i') {
            arr[1] = fixed;
        } else {
            fixed += arr[1][i];
        }
    }
    return math.complex(arr[0], arr[1]);
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
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
    let str = 'Resultado:<br>';
    for (var i = 0; i < CurrentN; i++) { str += Letters[i] + ': ' + result[i] + '<br>'; }
    document.getElementById("answer").innerHTML = str;
}

export function MyJSX(n) {
    if (n == CurrentN){return;}
    let str = '';
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            str += '<input id="A' + (i+1) + (j+1) + '" placeholder="A' + (i+1) + (j+1) + '">';
        }
        str += '<input id="' + Letters[i] + '" placeholder="' + Letters[i] + '" disabled>' +
        '<input id="b' + (i+1) + '" placeholder="b' + (i+1) + '"><br>';
    }
    document.getElementById("matrix").innerHTML = str;
    CurrentN = n;
}

export function Solve() {
    let A = [], b = [];
    for (var i = 0; i < CurrentN; i++) { A.push( [] ); }
    for (var i = 0; i < CurrentN; i++) {
        for (var j = 0; j < CurrentN; j++) {
            //A[i].push( get_complex( 'a' + (i+1) + (j+1) ) );    //Temporarily using the old parser
            A[i].push( CoolParse( 'A' + (i+1) + (j+1) ) );
        }
        //b.push( get_complex( 'r' + (i+1) ) );                   //Temporarily using the old parser
        b.push( CoolParse( 'b' + (i+1) ) );
    }
    prntResult(math.lusolve(A, b));
}