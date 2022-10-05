class searchVeiw {
  _parentElement = document.querySelector('.search');

  getquery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  addhandlersearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  _clear() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new searchVeiw();
