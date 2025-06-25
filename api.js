// grab form from html
const form = document.querySelector("#userForm");
// add an event listener on submit
form.addEventListener("submit", onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const dataObject = Object.fromEntries(data.entries());
  console.log(dataObject);
  // run adoptable pets on submit
  getAdoptablePets(dataObject);
  form.reset();
}
// this get token was here
function getToken() {
  return fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "OWdSiIGS3IdbNBUzt3B9B03244OU2a2ROzzVHOUetZqRKi7QAz",
      client_secret: "xD2DMVVTH7KA8abrfZ2dZb8m7Vr74LJbQfp6peG6",
    }),
  })
    .then((res) => res.json())
    .then((data) => data.access_token);
}
// function to make api call
function getAdoptablePets(formData) {
  getToken().then((token) => {
    fetch(
      `https://api.petfinder.com/v2/animals?type=${formData.type}&location=${formData.zip}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        //        show pets after api call
        showPets(data.animals);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  });
}
// function to show pets
function showPets(pets) {
  let container = document.querySelector(".container");
  //   reset container after submit previous results
  container.innerHTML = "";
  // loop through data to find data needed
  for (let pet of pets) {
    //     create cards to hold data
    let card = document.createElement("div");
    //     add styling to cards
    card.classList.add("cards");

    //     make variables for pet name breed pic color and description using dot notation from the data object

    let name = pet.name;
    let breed = pet.breeds.primary;
    let photo = pet.photos[0].medium;
    let color = pet.colors.primary;
    const description = pet.description;

    //     create an img element for image

    let img = document.createElement("img");
    img.src = photo;
    img.alt = name;

    //     create h2 for title
    let title = document.createElement("h2");
    title.textContent = name;

    //    create h3 for breedtype
    let breedType = document.createElement("h3");
    breedType.textContent = breed;

    //    create h4 for color
    let petColor = document.createElement("h4");
    petColor.textContent = color;

    // create a paragraph for description
    let descript = document.createElement("p");
    descript.textContent = description;

    // Append all elements to the card
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(breedType);
    card.appendChild(petColor);
    card.appendChild(descript);

    // lastly append the card to the container
    container.appendChild(card);
  }
}
