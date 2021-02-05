const getTokenRequest = new XMLHttpRequest();
const getArtworksRequest = new XMLHttpRequest();

const clientID = "7345cec4b7d5ed20f604",
  clientSecret = "2180438cede8f561b462f42a5775716d",
  apiUrl = "https://api.artsy.net/api";
let xappToken;

// get access token

getTokenRequest.open("POST", `${apiUrl}/tokens/xapp_token`);
getTokenRequest.setRequestHeader(
  "Content-Type",
  "application/x-www-form-urlencoded"
);

getTokenRequest.send(`client_id=${clientID}&client_secret=${clientSecret}`);

// handle request changes
getTokenRequest.onreadystatechange = () => {
  // Process the server response here.
  try {
    if (
      getTokenRequest.readyState === XMLHttpRequest.DONE ||
      getArtworksRequest.readyState === XMLHttpRequest.DONE
    ) {
      // Everything is good, the response was received.
      if (getTokenRequest.status === 201) {
        // Perfect!
        const res = JSON.parse(getTokenRequest.responseText);
        xappToken = res.token;
        getArtworks(xappToken);
      } else {
        console.log("There was a problem with the request.");
      }
    }
  } catch (err) {
    console.error(err);
  }
};

// get artworks

const getArtworks = (token) => {
  getArtworksRequest.open("GET", `${apiUrl}/artworks`);
  getArtworksRequest.setRequestHeader("X-Xapp-Token", token);
  getArtworksRequest.send(`X-Xapp-Token=${token}`);
};

getArtworksRequest.onreadystatechange = () => {
  try {
    if (getArtworksRequest.readyState === XMLHttpRequest.DONE) {
      // Everything is good, the response was received.
      if (getArtworksRequest.status === 200) {
        const res = JSON.parse(getArtworksRequest.responseText);
        const artworks = res._embedded.artworks;
        insertArtworks(artworks);
      } else {
        const artworksList = document.getElementById("artworks");
        artworksList.innerHTML = "<li><p>Something went wrong.</p></li>";
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const insertArtworks = (artworks) => {
  const artworksList = document.getElementById("artworks");
  artworksList.innerHTML = "";
  artworks.map((artwork) => {
    artworksList.insertAdjacentHTML(
      "beforeend",
      `<li><img src="${artwork._links.thumbnail.href}" alt="" /></li>`
    );
  });
};
