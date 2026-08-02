import axios from 'axios';

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

/**
 * @param {string} query
 * @param {number} page
 * @returns {Promise<object>}
 */
export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: PER_PAGE,
    },
  });

  return response.data;
}
