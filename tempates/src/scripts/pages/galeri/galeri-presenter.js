import galeriView from "./galeri";
import NavbarPresenter from "../../components/navbar-presenter";

export default class GaleriPresenter {
  constructor({ container }) {
    this.container = container;
    this.navbarPresenter = null;
  }

  async init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = galeriView();
  }

  attachEventListeners() {
    // Initialize navbar presenter
    this.navbarPresenter = new NavbarPresenter(this.container);
    this.navbarPresenter.attachEventListeners();
  }
}
