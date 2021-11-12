import './css/styles.css';
import { fetchCountries } from "./js/services/fech-countries";
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};
refs.input.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

function onSearchCountries(event) {
   const inputValue =  event.target.value;
   const trimInputValue = inputValue.trim();
   if(!trimInputValue){
    return;
   }

   fetchCountries(trimInputValue)
   .then(d =>{
       console.log(d);
       if(d.length > 10){
        Notify.info('Too many matches found. Please enter a more specific name.')
        
       }
       showCountries(d);

       
   })
   .catch(e => console.log(e));

}

function showCountries(countries) {
  return countries.map(country => {
    const markup = `<li class="country-list-item"><img src="${country.flags.svg}">${country.name.official}</li>`
        console.log(markup);
    }).join('');
}

// [0].name.official