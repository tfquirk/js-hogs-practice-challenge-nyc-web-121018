const URL = `http://localhost:3000/hogs`
const hogContainer = document.getElementById("hog-container")
const hogForm = document.getElementById("hog-form")

let allHogs = []

document.addEventListener("DOMContentLoaded", function(event) {

  getHogs(URL)

  hogForm.addEventListener("submit", e => {
    e.preventDefault()
    let name = e.target.name.value
    let specialty = e.target.specialty.value
    let medal = e.target.medal.value
    let weight = e.target.weight.value
    let img = e.target.img.value
    let greased = e.target.greased.checked
    console.log(img);
    console.log(typeof img);
    createNewHogCard(URL, name, specialty, medal, weight, img, greased)
  })

  hogContainer.addEventListener("click", e => {

    if (e.target.dataset.action === "delete") {
      e.target.parentNode.remove()
      deleteHog(`${URL}/${e.target.dataset.id}`)
    }

    if (e.target.checked) {
      let findPig = findHog(e.target.dataset.id)
      findPig.greased = !findPig.greased
      persistGreased(`${URL}/${e.target.dataset.id}`, findPig.greased)
    }
  })

})


// ---------------------------- Fetch ------------------------------------------

function getHogs(url) {
  fetch(url)
    .then(resp => resp.json())
    .then(hogs => {
      allHogs = hogs
      hogContainer.innerHTML = createHogHTML(allHogs)
    })
}

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

function deleteHog(url) {
  fetch(url, {
    method: "DELETE"
  })
}

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

function greased(hog) {
  return hog.greased ? "checked" : ""
}
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

function findHog(id) {
  return allHogs.find( hog => hog.id === parseInt(id))
}
