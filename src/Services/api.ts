const serverUrl = "https://memo-silver-app.herokuapp.com/api/";
const localUrl = "http://localhost:4000/api/";
const apiUrl = serverUrl || localUrl; //serverUrl
const defaultHeaders: HeadersInit = new Headers();
defaultHeaders.set('Content-Type', 'application/json');


const responseHandler = (response, clearResponse?) => {
  if (!response.ok) {
    console.error(response);
  }
  return clearResponse ? response : response.json();
}


export const getApiResponse = async (
    currentUrl: string,
    reqType: string,
    params?: any | null,
    clearResponse?: boolean):
    Promise<any> => {
  try {
    let paramsObj = {
      method: reqType,
      headers: defaultHeaders,
      body: null
    }
    if (params) paramsObj = {...paramsObj, body: JSON.stringify(params)}
    const response = await window.fetch(apiUrl + currentUrl, paramsObj);
    return responseHandler(response, clearResponse);
  } catch (error) {
    new Error(error.statusText);
  }
}




