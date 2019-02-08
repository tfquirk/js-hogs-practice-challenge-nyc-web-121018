const URL = `http://localhost:3000/hogs`                        // RESTful URL
const hogContainer = document.getElementById("hog-container")   // holds all hog cards
const hogForm = document.getElementById("hog-form")             // holds form to update hogs

let allHogs = []    // local variable to hold all hogs created with getHogs(URL) fetch

document.addEventListener("DOMContentLoaded", function(event) {

  //get all hogs from DB and update the DOM
  getHogs(URL)

  // listen to the form for submit
  hogForm.addEventListener("submit", e => {
    // prevent auto submit
    e.preventDefault()

    // grab all form values
    let name = e.target.name.value
    let specialty = e.target.specialty.value
    let medal = e.target.medal.value
    let weight = e.target.weight.value
    let img = e.target.img.value
    let greased = e.target.greased.checked
    console.log(img);
    console.log(typeof img);

    // fetch to create new hog
    createNewHogCard(URL, name, specialty, medal, weight, img, greased)
  })

  // listener for clicks on hog cards (delete or checkbox)
  hogContainer.addEventListener("click", e => {

    // if user clicks delete, card is removed from DOM and deleteHog fetch is invoked
    if (e.target.dataset.action === "delete") {
      e.target.parentNode.remove()
      deleteHog(`${URL}/${e.target.dataset.id}`)
    }

    // if user checks a checkbox change boolean value of greased, and send PATCH
    if (e.target.checked) {
      let findPig = findHog(e.target.dataset.id)
      findPig.greased = !findPig.greased
      persistGreased(`${URL}/${e.target.dataset.id}`, findPig.greased)
    }
  })

})


// ---------------------------- Fetch ------------------------------------------

// initial fetch to get all hogs - updates DOM
function getHogs(url) {
  fetch(url)
    .then(resp => resp.json())
    .then(hogs => {
      allHogs = hogs
      hogContainer.innerHTML = createHogHTML(allHogs)
    })
}

// fetch to POST, creates a new hog card and updates the DOM
function createNewHogCard(url, name, specialty, medal, weight, img, greased) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: name,
      specialty: specialty,
      greased: greased,
      "weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water": weight,
      "highest medal achieved": medal,
      image: img
    })
  }).then(response => response.json())
    .then(newPig => {
      allHogs.push(newPig)
      hogContainer.innerHTML += createHogHTML([newPig])
      hogForm.reset()
    })
}

// fetch to DB to delete a hog
function deleteHog(url) {
  fetch(url, {
    method: "DELETE"
  })
}


// updates the DB for a particular pigs greased boolean
function persistGreased(url, updateGreased) {
  fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      greased: updateGreased
    })
  })
}

// ---------------------------- Create HTML ------------------------------------

// checks the boolean value of a hog, and returns checked if the value is true
// this is used in the following funtion to allow for a alreay checked checkbox
function greased(hog) {
  return hog.greased ? "checked" : ""
}

// creates HTML for arraly of allHogs
function createHogHTML(hogs) {
  return hogs.map( hog => {
    return `<div class="hog-card">
              <h2>${hog.name}</h2>
              <img src="${hog.image}" alt="Picture of Hogwarts hog: ${hog.name}" height="250" width="250">
              <p>Specialty: ${hog.specialty}</p>
              <p>Weight as a ratio of hog: ${hog["weight as a ratio of hog to LG - 24.7 Cu. Ft. French Door Refrigerator with Thru-the-Door Ice and Water"]} </p>
              <p>Highest medal achieved: ${hog["highest medal achieved"]} </p>
              Greased: <input type="checkbox" name="greased" ${greased(hog)} data-id="${hog.id}"> <br> <br>
              <button type="button" data-id="${hog.id}" data-action="delete">Delete ${hog.name}</button>
            </div>`
  }).join("")
}

// ---------------------------- Helpers ----------------------------------------


// finds a hog based on their unique Id
function findHog(id) {
  return allHogs.find( hog => hog.id === parseInt(id))
}
