import {boolean_attributes} from "svelte/types/compiler/compile/render_ssr/handlers/shared/boolean_attributes";

const apiUrl = 'http://localhost:4000/api/';
const defaultHeaders: HeadersInit = new Headers();
defaultHeaders.set('Content-Type', 'application/json');
import type {MemosItem} from "../src/Interfaces/General";

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
    Promise<MemosItem> => {
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



