console.log('client side js file is loaded');

const forecastForm = document.querySelector('form');
const searchElement = document.querySelector('input');
const messageOne = document.querySelector('#message-one');
const messageTwo = document.querySelector('#message-two');
const countrySelect = document.getElementById("countries"); 
const stateSelect = document.getElementById('states')
const citySelect = document.getElementById('cities');

// populate lists on load
window.onload = (event) => {
    fetch('/locations').then((response) => {
        response.json().then((data) => {
            const countries = data;
            for (const country of countries){
                let el = document.createElement("option");
                el.text = country;
                el.value = country;
                if (country === "USA"){
                    el.selected = true;
                }
                countrySelect.add(el);
            }
            const country = countrySelect.value;
            fetch('/locations?country=' + country).then((response) => {
                response.json().then((data) => {
                    const states = data;
                    for (const state of states) {
                        let el = document.createElement("option");
                        el.text = state;
                        el.value = state;
                        stateSelect.add(el);
                    }
                }) 
            })
        });
    })
};
  
// re-populate state list on change to country list
countrySelect.addEventListener('change', () => {
    stateSelect.options.length = 0;
    const country = countrySelect.value;
    fetch('/locations?country=' + country).then((response) => {
        response.json().then((data) => {
            const states = data;
            for (const state of states) {
                let el = document.createElement("option");
                el.text = state;
                el.value = state;
                stateSelect.add(el);
            }
        }) 
    })
})

// re-populate city list on change to state list
stateSelect.addEventListener('change', () => {
    citySelect.options.length = 0;
    const state = stateSelect.value;
    const country = countrySelect.value;
    fetch('/locations?state='+state+'&country='+country).then((response) => {
        response.json().then((data) => {
            const cities = data;
            for (const city of cities) {
                let el = document.createElement('option');
                el.text = city;
                el.value = city;
                citySelect.add(el);
            }
        })
    })
})

forecastForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const state = stateSelect.value;
    const country = countrySelect.value;
    const city = citySelect.value;
    messageOne.textContent = 'loading';
    messageTwo.textContent = '';
    fetch('/forecast?city='+city+'&state='+state+'&country='+country).then((response) => {
        response.json().then((data) => {
            if (data.error){
                return messageOne.textContent = data.error;
            }
            messageOne.textContent = 'the current AQI in ' + city + ' is ' + data.pollution.aqius;
        })
    })
})