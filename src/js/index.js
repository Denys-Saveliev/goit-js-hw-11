import '../css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import cardImagesTpl from '../templates/card-images.hbs';
import PixabayApiService from './pixabayApiService';

const refs = {
  formRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
};

let lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 });

const pixabayApiService = new PixabayApiService();

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

refs.formRef.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  pixabayApiService.resetPage();
  clearMarkup();

  pixabayApiService.query = e.currentTarget.elements.query.value;
  pixabayApiService.getImage().then(result => {
    makeMarkupgallery(result.data.hits);
    Notiflix.Notify.success(`Hooray! We found ${pixabayApiService.totalHits} images.`);
    pixabayApiService.incrementPage();
  });
}

function clearMarkup() {
  refs.galleryRef.innerHTML = '';
}

function makeMarkupgallery(data) {
  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again',
    );
    return;
  }

  let markup = data.map(cardImagesTpl).join('');
  refs.galleryRef.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
  observer.observe(refs.galleryRef.lastElementChild);
}

function onEntry(entries) {
  entries.map(entry => {
    if (!entry.isIntersecting) {
      return;
    }

    observer.unobserve(entry.target);

    if (!pixabayApiService.endCurrentSearchQuery()) {
      pixabayApiService.getImage().then(result => {
        makeMarkupgallery(result.data.hits);
        pixabayApiService.incrementPage();
      });
    } else {
      Notiflix.Notify.failure(`We're sorry, but you've reached the end of search results.`);
    }
  });
}
