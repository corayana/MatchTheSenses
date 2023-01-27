const serverURL = "http://localhost:8000";
//const serverURL = "https://nschnell.uber.space/match-the-senses";

async function sendGetRequest(url) {
  const response = await fetch(serverURL + url, {
    method: "GET",
    headers: { "Content-Type": "text/plain" },
  });

  if (response.status !== 200) {
    return Promise.reject(response.statusText);
  }

  return response.json();
}

async function sendPostRequest(url, body) {
  const response = await fetch(serverURL + url, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: body,
  });

  if (response.status !== 200) {
    return Promise.reject(response.statusText);
  }

  return response.text();
}
