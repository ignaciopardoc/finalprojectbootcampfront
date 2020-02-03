
const API_URL = "http://localhost:3000/";

/* Tipado de entrada de atributos*/
export const myFetchFiles = async ({
    method = "GET",
    path,
    obj,
    formData,
    token
  }: {
    path: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    obj?: Object;
    formData?: FormData;
    token?: string;
  }) => {
    let headers = new Headers();
    let body = undefined;
    if (obj) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(obj);
    } else if (formData) {
      body = formData;
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    console.log(body);
    const response = await fetch(API_URL + path, {
      method,
      headers,
      body
    });
    try {
      const json = await response.json();
      return json;
    } catch {
      return null;
    }
  };