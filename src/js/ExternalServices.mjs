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
  // constructor(category) {
  //   this.category = category;
  
  // }
  async getData(category="") {
    try {

      const response = await fetch(baseURL+category);
      const result = await convertToJson(response);
      // const result = await convertToJson(response);
	console.log(result);
      return result;

    } catch (error) {
      console.error(error);
    }
  }

}



