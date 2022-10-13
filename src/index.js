import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();

  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  const searchQuery = e.target.value.trim();

  if (searchQuery !== '') {
    fetchCountries(searchQuery).then(renderCountry).catch(onError);
  }
}

function renderCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name');
    return;
  }

  if (2 < countries.length && countries.length < 10) {
    renderCountryList(countries);
    return;
  }

  renderCountryInfo(countries);
}

function renderCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li>
        <img src="${flags.svg}" alt="${name.official}" width="30px">
        <h2>${name.official}</h2>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      return `<img src="${flags.svg}" alt="${
        name.official
      }" width="30px" height="30px">
          <h2>${name.official}</h2>
          <p><b>Capital:</b> ${capital}</p>
          <p><b>Population:</b> ${population}</p>
          <p><b>Langueges:</b> ${Object.values(languages)}</p>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function onError(err) {
  Notify.failure('Oops, there is no country with that name');
}
