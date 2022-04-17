const axios = require('axios').default;

const API_KEY = '26800121-c2642468342c571cae32618c0';
const BASE_URL = 'https://pixabay.com/api/';
const quantityPerPage = 20;

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalHits = 0;
  }

  async getImage() {
    try {
      const response = await axios.get(
        `${BASE_URL}?&key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${quantityPerPage}&page=${this.page}`,
      );
      this.totalHits = response.data.totalHits;
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  endCurrentSearchQuery() {
    return (this.page - 1) * quantityPerPage > this.totalHits;
  }
}
