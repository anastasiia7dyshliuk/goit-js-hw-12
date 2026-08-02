import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('#load-more');
const galleryEl = document.querySelector('#gallery');

const PER_PAGE = 15;

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

formEl.addEventListener('submit', handleSearchSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreClick);

async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        title: 'Error',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (data.hits.length < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    event.currentTarget.reset();
  }
}

async function handleLoadMoreClick() {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    smoothScrollByTwoCards();

    const loadedCount = galleryEl.children.length;

    if (loadedCount >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

function smoothScrollByTwoCards() {
  const cardEl = galleryEl.querySelector('.gallery-item');
  if (!cardEl) return;

  const { height } = cardEl.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    left: 0,
    behavior: 'smooth',
  });
}
