import { async } from 'regenerator-runtime';
import { Api_Url, RES_page, key } from './config.js';
// import { getJSON, sendJSON } from './helrper.js';
import { Ajax } from './helrper.js';
import recipeView from './view/recipe.view.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resulrtPerPage: RES_page,
    search_page: 1,
  },
  Bookmark: [],
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.Bookmark));
};

const createObjectRecipe = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await Ajax(`${Api_Url}${id}?key=${key}`);
    state.recipe = createObjectRecipe(data);

    if (state.Bookmark.some(Bookmark => Bookmark.id === id))
      state.recipe.Bookmark = true;
    else state.recipe.Bookmark = false;
  } catch (err) {
    throw err;
  }
};

export const loadsearchResult = async function (query) {
  try {
    state.search.search_page = 1;
    state.search.query = query;
    const data = await Ajax(`${Api_Url}?search=${query}&key=${key}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),

      };
    });
  } catch (err) {
    throw err;
  }
};

export const getsearchResultPage = function (page = state.search.search_page) {
  state.search.search_page = page;

  const start = (page - 1) * state.search.resulrtPerPage;
  const end = page * state.search.resulrtPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * numServings) / state.recipe.servings;
  });
  state.recipe.servings = numServings;
};

export const addbookmark = function (recipe) {
  state.Bookmark.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.Bookmark = true;

  persistBookmarks();
};

export const deletebookmark = function (id) {
  const index = state.Bookmark.findIndex(el => el.id === id);
  state.Bookmark.splice(index, 1);
  if (id === state.recipe.id) state.recipe.Bookmark = false;

  persistBookmarks();
};

const init = function () {
  const stroge = localStorage.getItem('bookmarks');
  if (stroge) state.Bookmark = JSON.parse(stroge);
};
init();

const clearbookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearbookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim())
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'wrong ingredient format ! please enter correct format'
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? +quantity : null,
          unit: unit ? unit : '',
          description: description ? description : '',
        };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await Ajax(`${Api_Url}?key=${key}`, recipe);
    state.recipe = createObjectRecipe(data);
    addbookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
