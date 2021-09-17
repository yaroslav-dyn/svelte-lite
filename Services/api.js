import "svelte/types/compiler/compile/render_ssr/handlers/shared/boolean_attributes";
const apiUrl = 'http://localhost:4000/api/';
const defaultHeaders = new Headers();
defaultHeaders.set('Content-Type', 'application/json');
const responseHandler = (response, clearResponse) => {
    if (!response.ok) {
        console.error(response);
    }
    return clearResponse ? response : response.json();
};
export const getApiResponse = async (currentUrl, reqType, params, clearResponse) => {
    try {
        let paramsObj = {
            method: reqType,
            headers: defaultHeaders,
            body: null
        };
        if (params)
            paramsObj = Object.assign(Object.assign({}, paramsObj), { body: JSON.stringify(params) });
        const response = await window.fetch(apiUrl + currentUrl, paramsObj);
        return responseHandler(response, clearResponse);
    }
    catch (error) {
        new Error(error.statusText);
    }
};
//# sourceMappingURL=api.js.map