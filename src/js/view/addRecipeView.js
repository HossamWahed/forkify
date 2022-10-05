import view from './view.js';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends view {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was upload succesfuly';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnopen = document.querySelector('.nav__btn--add-recipe');
  _btnclose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addahndlershowwindow();
    this._addahndlerRemovewindow();
  }

  togglewindowshow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addahndlershowwindow() {
    this._btnopen.addEventListener('click', this.togglewindowshow.bind(this));
  }

  _addahndlerRemovewindow() {
    this._btnclose.addEventListener('click', this.togglewindowshow.bind(this));
    this._overlay.addEventListener('click', this.togglewindowshow.bind(this));
  }

  addhandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generatemarkup() {}
}
export default new addRecipeView();
