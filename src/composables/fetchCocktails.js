import { ref } from "vue";
const baseURL = "https://www.thecocktaildb.com/api/json/v2";
const apiKey = (import.meta.env.VITE_API_KEY ? import.meta.env.VITE_API_KEY : 1);

//sends Fetch API request returning results as json
const sendRequest = async (requestUrl) => {
  //returns promise containing response object on resolve
  try {
    const response = await fetch(requestUrl);
    if (response.status !== 200) {
      throw new Error(response.status + " - Unable to fetch data.");
    }
    const responseJSON = await response.json();
    return responseJSON;
  } catch (err) {
    //ADD SWITCH CASE FOR CUSTOM ERRORS
    return Promise.reject(err.message);
  }
};

//returns a promise resolving to an array of cocktails
const fetchCocktailsByChar = (char) => {
  const query = `search.php?f=${char}`;
  const requestUrl = `${baseURL}/${apiKey}/${query}`;
  const response = sendRequest(requestUrl);
  return response;
}

//returns an array of promises 
const fetchCocktailsAZ = () =>{
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const charsAZ = Array.from(alphabet);
  return charsAZ.map(async char=>{
    return fetchCocktailsByChar(char);
  })
};

//COMPOSABLE FUNCTION
const getAllCocktails = () => {
  const allCocktails = ref([]);
  const error = ref(null);

  const fetchData = async () => {
    //clear cocktails array
    allCocktails.value = [];
    let data = [];
    try {
      //resolve all promises to an array of cocktail arrays a-z
      data = await Promise.all(fetchCocktailsAZ());
      /* remove any null responses, convert all cocktail data
      / to single array*/
      data.forEach((element) => {
        if (element.drinks !== null) {
          allCocktails.value = allCocktails.value.concat(element.drinks);
        }
      });
    } catch (err) {
      console.log(err);
      error.value = err;   
    }
  };
  return { allCocktails, fetchData, error };
};

export default getAllCocktails;
