import view from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class resultView extends view {
  _parentElement = document.querySelector('.results');
  _errormessage = 'no recipes found in your query please try again!';
  _message = '';

  _generatemarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultView();
