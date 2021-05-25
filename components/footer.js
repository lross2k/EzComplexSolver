class Footer extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <link rel="stylesheet" href="./components/footer.css">
        <footer>
        <p>Proyecto de: <a href="https://github.com/lross2k">lross2k</a></p>
        <a href="https://github.com/lross2k/lross2k.github.io">Repositorio en GitHub</a>
        </footer>
        `
    }
}

customElements.define('app-footer', Footer);
