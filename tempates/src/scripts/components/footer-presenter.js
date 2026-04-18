import footerView from './footer';

export default class FooterPresenter {
    constructor({ container }) {
        this.container = container;
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = footerView();
    }
}