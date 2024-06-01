const baseURL = 'https://wdd330-api.onrender.com/api/random';
// const baseURL = 'http://127.0.0.1:3030/api/random';


// const baseURL = +"http://server-nodejs.cit.byui.edu:3000/";
function convertToJson(res) {
  let jsonResponse  = res.json();
  if (res.ok) {
    return jsonResponse ;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {

  }
  async getData(max1,max2,level,operator) {
    try {
      let url = `${baseURL}/?max1=${max1}&max2=${max2}&level=${level}&operator=${operator}`
      
      const response = await fetch(url);
      const result = await convertToJson(response);
      // const result = await convertToJson(response);
      return result;

    } catch (error) {
      console.error(error);
    }
  }

}



