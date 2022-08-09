// Objects of this class will contain all the functionality for each matrix
class MatrixViewport extends HTMLElement {    
    connectedCallback() {
        this.n = this.getAttribute("n");    
        this.id = this.getAttribute("id");
        this.mat = new Matrix(this.n, this.id);
        this.render();
        this.setListeners();
    }

    render() {
        this.innerHTML = `
        `+ this.mat.getMatrix() +`
        <div class="buttons">
            <div id="dim-btn`+ this.id +`">
                <select name="options" id="select` + this.id + `">
                    <option value="1">1x1</option>
                    <option value="2">2x2</option>
                    <option value="3">3x3</option>
                    <option value="4">4x4</option>
                    <option value="5">5x5</option>
                    <option value="6">6x6</option>
                    <option value="7">7x7</option>
                    <option value="8">8x8</option>
                </select>
                <button class="update-btn" id="update` + this.id + `">Dimensionar</button>
            </div>
            <div id=solve>
                <button class="solve-btn" id="solve`+ this.id +`">Calcular</button>
            </div>
        </div>
        <div id="ans-wrap`+ this.id +`" class="ans-wrap">
            <div class="sub-ans">
                <h3>Rectangular</h3>
                <p id="answer`+ this.id +`">___</p>
                <h3 id="error`+ this.id +`"></h3>
            </div>
            <div class="sub-ans">
                <h3>Polar</h3>
                <p id="ans-pol`+ this.id +`">___</p>
                <h3 id="error`+ this.id +`"></h3>
            </div>
        </div>
        `
        document.getElementById("select" + this.id).value = this.mat.n;
    }

    // it just works        // might be able to directly extern them?
    setListeners() {
        externListeners(this);
    }

    update() {
        this.mat.n = document.getElementById("select" + this.id).value;
        this.mat.updateMatrix();
        this.render();
    }

    solveMatrix() {
        this.mat.solve();
    }

}

// To easily (and lazily) dispose of the old matrix
class Matrix {
    constructor(n, id) {
        this.n = n;
        this.id = id;
        this.createMatrix();
        this.legalChrs = ['+','-','i','j',',','.'];
    }

    // Creates the html for the rendering of the matrix
    createMatrix() {
        let str = '';
        str += '<div class=matrix id=matrix' + this.id + '>';
        for (let i = 0; i < this.n; i++) {
            str += '<div id="matrix-row">';
            for (let j = 0; j < this.n; j++) {
                str += '<input class="input-num" id="' + this.id + 'A' + (j+1) + (i+1) + '" placeholder="A' + (j+1) + (i+1) + '">';
            }
            str += '<input class="x-num" placeholder="x' + (i+1) + '" disabled>' +
            '<input class="input-num" id="' + this.id + 'b' + (i+1) + '" placeholder="b' + (i+1) + '"></div>';
        }
        this.matrix = str;
    }

    // Method that uses math.js to solve the system of equations
    solve() {
        let A = [], b = [], parsed = '';
        // Generate empty Matrix A 
        for (var i = 0; i < this.n; i++) { A.push( [] ); }
        // Iterate i from 0 to n (rows)
        for (var i = 0; i < this.n; i++) {
            // Iterate j from 0 to n (columns)
            for (var j = 0; j < this.n; j++) {
                parsed = this.weirdParser(this.id + 'A' + (j+1) + (i+1) );
                if (parsed === 'error') {
                    // Error messages, pretty bad
                    document.getElementById("ans-wrap"+ this.id).style.backgroundColor = "#990000";
                    document.getElementById("error"+ this.id).innerText = "Error por números complejos, casilla: " + 'A' + (j+1) + (i+1);
                    document.getElementById("answer"+ this.id).innerText = "No se pudo calcular";
                    return;
                }
                A[i][j] = parsed;
                if (i === 1) {
                    console.log(parsed);
                    console.log(A);
                }
            }
            parsed = this.weirdParser( this.id + 'b' + (i+1) );   //id="' + this.id + 'b' + (i+1) + '"
            if (parsed == 'error') {
                document.getElementById("ans-wrap"+ this.id).style.backgroundColor = "#990000";
                document.getElementById("error"+ this.id).innerText = "Error por números complejos, casilla: " + 'b' + (i+1);
                document.getElementById("answer"+ this.id).innerText = "No se pudo calcular";
                return;
            }
            b.push( parsed );
        }
        console.log("Matrices");
        console.log(A);
        console.log(b);
        let reslt = elimGaussComplex(A, b);
        console.log(reslt)
        this.prntResult(reslt);
    }

    // Old parser I have yet to re-implement using regex
    weirdParser(id) {
        // I'd comment more on this, but I plan on rewriting this whole thing with regex
        let str = document.getElementById( id ).value, clstr = '';
        if (str == '') { 
            document.getElementById(id).value = 0;
            return new Complex(0,0);
        }
        for (var i = 0; i < str.length; i++) {
            if ( this.isNumeric(str[i]) || ( this.legalChrs.indexOf(str[i]) >= 0 ) ) {
                clstr += str[i];
            } else {
                document.getElementById("ans-wrap"+ this.id).style.backgroundColor = "#FFCC33";
                document.getElementById("error"+ this.id).innerText = "Precaución! Carácteres indeseados fueron detectados";
                document.getElementById("ans-wrap"+ this.id).style.backgroundColor = "#FFCC33";
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
                answer = new Complex( parseFloat(fstr), parseFloat(sstr) );
            } else {
                return 'error';
            }
        } else if (fstr.charAt(fstr.length-1) == 'i' || fstr.charAt(fstr.length-1) == 'j') {
            sstr = sstr != '' ? sstr : 0;
            answer = new Complex( parseFloat(sstr), parseFloat(fstr) );
        } else if ( this.isNumeric(fstr) && this.isNumeric(sstr)) {
            answer = new Complex( parseFloat(sstr), parseFloat(fstr) );
        } else {
            fstr = this.isNumeric(fstr) ? fstr : 0;
            sstr = this.isNumeric(sstr) ? fstr : 0;
            answer = new Complex( parseFloat(fstr), parseFloat(sstr) );
        }
        return answer;
    }

    // Inserts the result in the index.html using .innerHTML
    prntResult(result) {
        let str = '';
        let pol = '';

        // Printing in rectangular form
        for (var i = 0; i < this.n; i++) { str += 'real_' + (i+1) + ': ' + Number(result[i][0].re).toFixed(9) +
        ' img_' + (i+1) + ': ' + Number(result[i][0].im).toFixed(9) + 'i <br>'; }
        document.getElementById("answer"+ this.id).innerHTML = str;

        // Printing in phasor form
        for (var i = 0; i < this.n; i++) {
            if (result[i][0] != 0) {
                //console.log("prueba");
                //console.log(result);  // DEBUG
                pol += 'mag_' + (i+1) + ': ' + Number(Math.sqrt((result[i][0].re)**2 + (result[i][0].im)**2)).toFixed(9) +
                ' ang_' + (i+1) + ': ' + Number(Math.atan(result[i][0].im/result[i][0].re)*180/Math.PI).toFixed(9) +
                'º <br>';
            } else {
                pol += 'x' + (i+1) + ': ' + 0 + '<br>';
            }
        }
        document.getElementById("ans-pol"+ this.id).innerHTML = pol;
    }

    // Takes a string and returns True if the string is a number
    isNumeric(str) {
        if (typeof str != "string") return false
        return !isNaN(str) && !isNaN(parseFloat(str))
    }
    
    // Well, guess what it does
    getMatrix() {
        return this.matrix;
    }

    // I don't remeber why I created this
    updateMatrix() {
        this.createMatrix();
    }
}

customElements.define("app-matrixview", MatrixViewport);

// Don't even ask why I did this workaround for the listeners, it works
function externListeners(mat) {
    mat.btnUpdate = document.getElementById("update" + mat.id);
    mat.btnUpdate.addEventListener("click", () => {
        mat.update();
        mat.setListeners();
    });
    mat.btnSolve = document.getElementById("solve" + mat.id);
    mat.btnSolve.addEventListener("click", () => {
        mat.solveMatrix();
    });
}
