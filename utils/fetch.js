
const axios = require('axios');

async function fetchData(key='http://localhost:8000') {
  try {
    const response = await axios.get(key, {
      headers: {
        'Accept': 'application/json, text/html',
      }
    });

    if (response.headers['content-type'].includes('application/json')) {
      //console.log('JSON response:', response.headers);
      return {
        body: response.data,
        headers: response.headers
      }
    } else if (response.headers['content-type'].includes('text/html')) {
      //console.log('HTML response:', response.headers); // handle HTML response if needed
      return {
        body: response.data,
        headers: response.headers
      }
    } else {
      //console.log('Other response:', response.data);
      return {
        body: response.data,
        headers: response.headers
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
fetchData()

module.exports = { fetchData };
