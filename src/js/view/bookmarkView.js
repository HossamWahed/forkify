import view from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class bookmarkView extends view {
  _parentElement = document.querySelector('.bookmarks__list');
  _errormessage = 'No bookmarks yet. Find a nice recipe and bookmark it ';
  _message = '';

  addhandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generatemarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new bookmarkView();
