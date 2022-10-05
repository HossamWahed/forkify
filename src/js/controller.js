import * as model from './model.js';
import { Model_close_sec } from './config.js';
import recipeView from './view/recipe.view.js';
import serchVeiw from './view/serchVeiw.js';
import resultView from './view/resultView.js';
import paginationView from './view/pagination.js';
import bookmarkView from './view/bookmarkView.js';
import addRecipeView from './view/addRecipeView.js';

import { async } from 'regenerator-runtime';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept();
}
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSppiner();
    // 0)
    resultView.update(model.getsearchResultPage());

    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) rendering recipe
    recipeView.render(model.state.recipe);

    //3) updating bookmark view
    bookmarkView.update(model.state.Bookmark);
   
  } catch (err) {
    recipeView.render(model.state);
  }
};

const controlrsearchResult = async function () {
  try {
    resultView.renderSppiner();
    // 1) get query
    const query = serchVeiw.getquery();
    if (!query) return;

    // 2) load result from query
    await model.loadsearchResult(query);

    // 3) render search page
    resultView.render(model.getsearchResultPage());

    // 4) page result
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPanigation = function (gotopage) {
  // 1. render new page
  resultView.render(model.getsearchResultPage(gotopage));

  // 2. new page result
  paginationView.render(model.state.search);
};

const constrolservings = function (numServings) {
  model.updateServings(numServings);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controladdbookmark = function () {
  // 1) add bookmark
  if (!model.state.recipe.Bookmark) model.addbookmark(model.state.recipe);
  // 2) delete bookmark
  else model.deletebookmark(model.state.recipe.id);
  // 3) upadet recipe
  recipeView.update(model.state.recipe);

  // 4) render bookmark
  bookmarkView.render(model.state.Bookmark);
};

const controlbookmarks = function () {
  bookmarkView.render(model.state.Bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try{
    //spinner recipe 
    addRecipeView.renderSppiner()

    // upload newRecipe
    await  model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe)

    // sucess message
    addRecipeView.rendermessage()
    
    // render bookmark VIEW 
    bookmarkView.render(model.state.Bookmark)
    
    // change ID
    window.history.pushState(null ,'' ,`#${model.state.recipe.id}`)

  // close form 
  setTimeout(function(){
    addRecipeView.togglewindowshow()
  },Model_close_sec *1000)
 

  }catch(err){
    console.error(err);
    addRecipeView.renderError(err)
  }
};

const init = function () {
  bookmarkView.addhandlerRender(controlbookmarks);
  recipeView.addhandlerevent(controlRecipe);
  recipeView.addhandlerUpdatingServing(constrolservings);
  recipeView.addhandlerBookmark(controladdbookmark);
  serchVeiw.addhandlersearch(controlrsearchResult);
  paginationView.addhandlerclick(controlPanigation);
  addRecipeView.addhandlerUpload(controlAddRecipe);
};
init();
