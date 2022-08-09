class Body extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <link rel="stylesheet" href="./components/body.css">
        <app-navbar></app-navbar>
        <!-- No banner
        <h3 class="mensaje">¡Este sitio aún no se encuentra finalizado!</h3>
        -->
        <app-matrixview id=1 n=2></app-matrixview>
        `
    }
}

//<app-matrixview id=2 n=2></app-matrixview>        // future feature for multiple matrices

customElements.define("body-wrapper", Body);
