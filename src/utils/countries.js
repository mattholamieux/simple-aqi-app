const request = require('request');

const countries = (callback) => {
    const url = "http://api.airvisual.com/v2/countries?key=73128bb8-6cd4-4e48-b9a3-56c3fbae6ec9"
    
    request({url: url, json: true}, (error, {body} = {}) => {
        if (error){
            callback('unable to connect to service', undefined);
        } else if (body.status === 'fail') {
            callback(body.data.message, undefined);
        } else {
            const data = body.data;
            const countries = data.map(obj => obj.country);
            callback(undefined, countries);
        }
    })
}

module.exports = countries;