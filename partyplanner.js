const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/2402-FTB-ET-WEB-PT/events`;

const state = {
  parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}
render();


async function getParties() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.parties = data.data;
  } catch (error) {
    console.log(error);
  }
}


async function deleteParty(id) {
  //try always aims to execute first
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    //if RESPONSE IS NOT OK, 
    if (!response.ok) {
      throw new Error(`Failed to delete party: ${await response.text()}`);
    }

    // Updates the state to remove the deleted party
    state.parties = state.parties.filter(party => party.id !== id);
    renderParties();
  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  //this clears the data before rendering
  partyList.innerHTML = "";

  for (let i = 0; i < state.parties.length; i++) {
    const currentParty = state.parties[i];


    const formattedDate = new Date(currentParty.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Creates the list
    const partyItem = document.createElement("li");

    // Creates the party info as list items
    const partyInfo = `
      <ul>
        <li>${currentParty.name}</li>
        <li>${formattedDate}</li>
        <li>${currentParty.location}</li>
        <li>${currentParty.description}</li>
      </ul>`;
    partyItem.innerHTML = partyInfo;

    // Creates the delete button and configures it to a CLICK
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteParty(currentParty.id));

    // Append list items to the party list
    partyItem.appendChild(deleteButton);
    partyList.appendChild(partyItem);
  }
}


/**
 * Asks the API to create a new party based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  const nameInput = document.querySelector('input[name="name"]')
  const descofPartyInput = document.querySelector('input[name="descofParty"]')
  const dateInput = document.querySelector('input[name="date"]')
  const locationInput = document.querySelector('input[name="location"]')

//.value is the data that is input through the form
  const name = nameInput.value
  const description = descofPartyInput.value
  const location = locationInput.value
  const date = dateInput.value + "T" + addPartyForm.time.value + ":00.000Z";

//this part sends data to the API in the format its looking for.
  try {
    //await pauses the execution of the code until fetch completes
    const response = await fetch(API_URL, {
      //this is an options object, this specifies its being sent to the server
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description,
        date,
        location,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
