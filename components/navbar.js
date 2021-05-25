class Navbar extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML =`
        <link rel="stylesheet" href="./components/navbar.css">
        <header>
            <h1>Solucionar sistemas de ecuaciones</h1>
        </header>
        `
    }
}

customElements.define('app-navbar', Navbar);
