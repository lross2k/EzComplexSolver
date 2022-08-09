// Javascript has no complex data type...
class Complex {
    constructor(a,b) {
        this.a = a;
        this.b = b;
    }
    cdiv(c2) {
        let a = this.a;
        let b = this.b;
        let c = c2.a;
        let d = c2.b;
        return new Complex( (a*c + b*d)/(c*c + d*d), 
                            (b*c - a*d)/(c*c + d*d)
                          );
    }
    cmul(c2) {
        let a = this.a;
        let b = this.b;
        let c = c2.a;
        let d = c2.b;
        return new Complex( (a*c + b*d), 
                            (a*d + b*c)
                          );
    }
    csub(c2) {
        let a = this.a;
        let b = this.b;
        let c = c2.a;
        let d = c2.b;
        return new Complex( a-c,
                            b-d
                          );
    }
    cadd(c2) {
        let a = this.a;
        let b = this.b;
        let c = c2.a;
        let d = c2.b;
        return new Complex( a+c,
                            b+d
                          );
    }
}

// Simple transpose function hack
function transpose(x) {
    for (let i = 0; i < x.length; i++) {
        x[i] = [x[i]];
    }
    return x;
}

function  elimGauss(A,b) {
    x = [];
    // Constant declarations
    const n = A.length	// Matrix dimension
    // Forward elimination process
    for (let k = 0; k < n-1; k++) {
        for (let i = k+1; i < n; i++) {
            F = A[i][k]/A[k][k];
            for (let j = 0; j < n; j++) {
                A[i][j] = A[i][j] - F*A[k][j];
            }
            b[i][0] = b[i][0] - F*b[k][0];
        }
    }
    // Reverse substitution process
    x = new Array(n); // Array with n elements
    for (let i = n-1; i > -1; i--) {
        let suma = 0;
        for (let j = i+1; j < n; j++) {
            suma = suma + A[i][j]*x[j];
        }
        x[i] = (b[i][0] - suma)/A[i][i];
    }
    // Transpose result 
    //x = x';
    x = transpose(x);
    return x;
}

function  elimGaussComplex(A_old,b_old) {
    let A = A_old.slice();
    let b = b_old.slice();
    let x = [];
    // Constant declarations
    const n = A.length	// Matrix dimension
    // Forward elimination process
    for (let k = 0; k < n-1; k++) {
        for (let i = k+1; i < n; i++) {
            if (A[k][k].constructor !== (new Complex).constructor) {
                A[k][k] = new Complex(A[k][k],0);                                
            }
            if (A[i][k].constructor !== (new Complex).constructor) {
                A[i][k] = new Complex(A[i][k],0);                                
            }
            F = A[i][k].cdiv(A[k][k]);
            for (let j = 0; j < n; j++) {
                if (A[i][j].constructor !== (new Complex).constructor) {
                    A[i][j] = new Complex(A[i][j],0);                                
                }
                if (A[k][j].constructor !== (new Complex).constructor) {
                    A[k][j] = new Complex(A[k][j],0);                                
                }
                A[i][j] = A[i][j].csub(F.cmul(A[k][j]));
            }
            if (b[i][0].constructor !== (new Complex).constructor) {
                b[i][0] = new Complex(b[i][0],0);                                
            }
            if (b[k][0].constructor !== (new Complex).constructor) {
                b[k][0] = new Complex(b[k][0],0);                                
            }
            b[i][0] = b[i][0].csub(F.cmul(b[k][0]));
        }
    }
    // Reverse substitution process
    x = new Array(n); // Array with n elements
    for (let i = 0; i < n; i++) {
        x[i] = new Complex(0,0);
    }
    for (let i = n-1; i > -1; i--) {
        let suma = new Complex(0,0);
        for (let j = i+1; j < n; j++) {
            suma = suma.cadd(A[i][j].cmul(x[j]));
        }
        x[i] = b[i][0].csub(suma).cdiv(A[i][i]);
    }
    // Transpose result 
    //x = x';
    x = transpose(x);
    return x;
}

//let A = [[1,-1],[2,0]];
//let b = [[5],[2]];
//console.log(elimGauss(A,b));

//let a1 = new Complex(1,-4);
//A = [[a1,-1],[2,0]];
//b = [[5],[2]];
//console.log(elimGaussComplex(A,b));

