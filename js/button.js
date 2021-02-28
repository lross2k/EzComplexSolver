export function fn1() {
    var num1 = document.getElementById("num1").value;
    num1 = parseFloat(num1);
    var num2 = document.getElementById("num2").value;
    num2 = parseFloat(num2);
    var result = num1 + num2;
    alert("The sum gave "+ result);
}

function clear_format(num) {
    var fixed = "";
    for (var i = 0; i < num[1].length ; i++) {
        if (num[1][i] == 'j' || num[1][i] == 'i') {
            num[1] = fixed;
        } else {
            fixed += num[1][i];
        }
    }
    return num
}

function get_complex(id) {
    var num = clear_format( document.getElementById( id ).value.split( '+' ) );
    return math.complex(num[0], num[1]);
}

export function complex() {
    const a = get_complex("num1");
    const b = get_complex("num2");
    console.log('real: ' + a.re + ' imaginario: ' + a.im);
    console.log('real: ' + b.re + ' imaginario: ' + b.im);
    var suma = math.complex( (a.re + b.re), (a.im + b.im) );
    console.log('suma: ' + suma);
}