import './css/styles.css';
import { fetchCountries } from "./js/services/fech-countries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const LENGTH = 10;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(event) {
   const inputValue =  event.target.value;
   const trimedInputValue = inputValue.trim();
   
   if(!trimedInputValue){
    refs.countryList.innerHTML = "";
    refs.countryInfo.innerHTML = "";
    return;
   }

   fetchCountries(trimedInputValue)
   .then(data => {
       
        if(data.length > LENGTH){
            Notify.info('Too many matches found. Please enter a more specific name.')
            return;
        }
        
       const markup = renderCountries(data);
       const cardMarkup = renderCountryCard(data);
       if(data.length === 1){
           
           refs.countryInfo.innerHTML = cardMarkup;
        } else {

            refs.countryList.innerHTML =  markup;
        }
        
   })
   .catch(showError);

}

function renderCountries(countries) {
    refs.countryInfo.innerHTML = "";

  return countries.map(country => {
    return `<li class="country-list-item"><img class="country-flag-image" src="${country.flags.svg}">${country.name.official}</li>`
        
    }).join('');
}

function renderCountryCard(name) {
    refs.countryList.innerHTML = "";

    const countryLanguages = Object.values(name[0].languages);
    return `
    <ul class=country-card-list>
    <li class="country-card-item"><img class="country-flag-image" src="${name[0].flags.svg}"><b class="country-card-desc">${name[0].name.official}</b></li>
    <li class="country-card-item"><b>Capital</b>: ${name[0].capital}</li>
    <li class="country-card-item"><b>Population</b>: ${name[0].population}</li>
    <li class="country-card-item"><b>Languages</b>: ${countryLanguages}</li></ul>`
}

function showError() {
    Notify.failure("Oops, there is no country with that name");
    
}



