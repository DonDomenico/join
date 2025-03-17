let contacts = [];
let tasks = [];
const contactColors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];
let sortedStartingLetters = [];
let uniqueStartingLetters = [];

/**
 * Initializes the contacts by including HTML, loading contacts, loading tasks, 
 * loading user initials, displaying contacts, unlogging all sidebar links, 
 * and logging the "contactSidebar" link.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initContacts() {
  includeHTML();
  await loadContacts();
  await loadAllTasksContacts();
  await loadUserInitials();
  displayContacts();
  unlogAllSidebarLinks();
  logSidebarLink("contactSidebar");
}

/**
 * Asynchronously loads contacts from the remote server and parses the response.
 *
 * @return {Promise<void>} A promise that resolves when the contacts are loaded and parsed.
 */
async function loadContacts() {
  try {
    let userIndex = getUserIndex();
    contacts = await getItem(`users/${userIndex}/contacts`);
  } catch (error) {
    console.log("No contacts stored in database");
  }
}

function getUserIndex() {
  return localStorage.getItem("userIndex");
}

/**
 * Asynchronously loads all tasks from the remote server and parses the response.
 *
 * @return {Promise<void>} A promise that resolves when all tasks are loaded and parsed.
 */
async function loadAllTasksContacts() {
  await getItem("tasks");
}

/**
 * Displays the contacts by sorting them by name, creating starting letters,
 * displaying starting letters, and rendering contacts under starting letters.
 *
 * @param {type} contactsContainer - the container element to display the contacts in
 * @return {type} undefined
 */
function displayContacts() {
  let contactsContainer = document.getElementById("all-contacts");
  contactsContainer.innerHTML = "";
  sortContactsByName();
  createStartingLetters();
  displayStartingLetters(contactsContainer);
  renderContactUnderStartingLetter();
}

/**
 * Displays the unique starting letters for all contacts.
 *
 * @param {HTMLElement} contactsContainer - the container element to display the contacts in
 * @return {void} 
 */
function displayStartingLetters(contactsContainer) {
  for (let i = 0; i < uniqueStartingLetters.length; i++) {
    let letter = uniqueStartingLetters[i];
    contactsContainer.innerHTML += /*html*/ `
            <h3 class="starting-letter">${letter.toUpperCase()}</h3>
            <div class="contacts-at-letter" id="contacts-at-letter${letter}"></div>
        `;
  }
}

/**
 * Renders the contacts under their respective starting letters.
 *
 * @return {undefined} This function does not return a value.
 */
function renderContactUnderStartingLetter() {
  if(contacts !== null) {
    for (let i = 0; i < contacts.length; i++) {
      let contact = contacts[i];
      for (let j = 0; j < uniqueStartingLetters.length; j++) {
        let startingLetter = uniqueStartingLetters[j];
        let contactsAtLetterContainer = document.getElementById(`contacts-at-letter${startingLetter}`);
        if (contact.userName[0] == startingLetter) {
          contactsAtLetterContainer.innerHTML += generateContactUnderStartingLetter(contact, i);
          break;
        }
      }
    }
  }
}

/**
 * Generates the HTML code for a contact element under its starting letter.
 *
 * @param {Object} contact - The contact object containing the contact details.
 * @param {number} i - The index of the contact in the contacts array.
 * @return {string} The generated HTML code for the contact element.
 */
function generateContactUnderStartingLetter(contact, i) {
  return `
    <div class="contact" id="contact${i}" onclick="displayContactDetails(${i}); toggleActiveContact(${i})">
        <div style="background-color: ${contact.userColor}" class="initials_circle initials_circle_small"><span class="initials_span">${contact.userInitials}</span></div>
        <div class="name-and-mail">
            <span class="contact_name_left_section" id="contact-name${i}">${contact.userName}</span>
            <span class="contact-mail">${contact.userEmail}</span>
        </div>
    </div>
 `;
}

/**
 * Toggles the active state of a contact element based on the given index.
 *
 * @param {number} i - The index of the contact element to be toggled.
 * @return {void} This function does not return a value.
 */
function toggleActiveContact(i) {
  let selectedContact = document.getElementById(`contact${i}`);
  let allContacts = document.querySelectorAll(".contact");

  allContacts.forEach((e) => {
    e.classList.remove("contact-selected");
  });
  selectedContact.classList.add("contact-selected");
}

/**
 * Displays the detailed infos of a contact.
 *
 * @param {number} i - The index of the contact in the contacts array.
 * @return {void} This function does not return a value.
 */
function displayContactDetails(i) {
  let contactContainer = document.getElementById("contact-container");
  let contact = contacts[i];
  let contactInformation = document.getElementById("contact-information");
  contactContainer.innerHTML = generateContacts(contact, i);
  contactInformation.innerHTML = generateContactInformation(contact);
  if (window.innerWidth < 900) {
    document.getElementById("leftSection").classList.add("d_none");
    document.getElementById("rightSection").classList.add("d_block");
    document.getElementById("backButtonContacts").classList.remove("d_none");
    document.getElementById("personButtonContacts").classList.add("d_none");
    document.getElementById("threeDotsButtonContacts").classList.remove("d_none");
  }
}

/**
 * Generates the HTML code for displaying contact information.
 *
 * @param {Object} contact - The contact object containing the contact details.
 * @return {string} The generated HTML code for displaying contact information.
 */
function generateContactInformation(contact) {
  return /*html*/ `
    <p>Contact Information</p>
    <h4>Email</h4>
    <a class="contact-email" href="mailto: ${contact.userEmail}">${contact.userEmail}</a>`;
}

/**
 * Generates HTML code for displaying contact details.
 *
 * @param {Object} contact - The contact object containing the contact details.
 * @param {number} i - The index of the contact in the array.
 * @return {string} The generated HTML code for displaying contact information.
 */
function generateContacts(contact, i) {
  return /*html*/ `
    <div style="background-color: ${contact.userColor}" class="initials_circle initials_circle_overview">
      <span class="initials_span">${contact.userInitials}</span>
    </div>
    <div class="name-and-edit">
      <div class="name_container">
          <span class="contact_name">${contact.userName}</span>
      </div>
      <div class="edit_delete_container">
        <button class="edit-button" onclick="openEditContact(${i})" onmouseover="turnBlue('penContacts', 'edit_blue.svg')" onmouseleave="turnBlack('penContacts', 'edit.svg')">
          <img id="penContacts" class="penContacts" src="../assets/img/icons/edit.svg" alt="">
          Edit
        </button>
        <button class="edit-button" onclick="deleteContactInOverview(${i})" onmouseover="turnBlue('trashContacts', 'delete_blue.svg')" onmouseleave="turnBlack('trashContacts', 'delete.svg')">
          <img id="trashContacts" src="../assets/img/icons/delete.svg" alt="">
          Delete
        </button>
      </div>
    </div>
    <div id="editDeleteButtonContainer" class="edit_delete_button_container d_none">
      <button class="edit_mobile_button" type="button" onclick="openEditContact(${i})">Edit</button>
      <button class="delete_mobile_button" type="button" onclick="deleteContactInOverview(${i})">Delete</button>
    </div>
  `;
}

/**
 * Shows the left section by removing the "d_none" class from the "leftSection" element and the "rightSection" element,
 * and adding the "d_none" class to the "backButtonContacts" element and the "personButtonContacts" element.
 * Also adds the "d_none" class to the "threeDotsButtonContacts" element.
 *
 * @return {void} This function does not return a value.
 */
function showLeftSection() {
  document.getElementById("leftSection").classList.remove("d_none");
  document.getElementById("rightSection").classList.remove("d_block");
  document.getElementById("backButtonContacts").classList.add("d_none");
  document.getElementById("personButtonContacts").classList.remove("d_none");
  document.getElementById("threeDotsButtonContacts").classList.add("d_none");
}

/**
 * Opens the edit/delete menu by removing the "d_none" class from the "editDeleteButtonContainer" element
 * and stopping the propagation of the event.
 *
 * @param {Event} event - The event object.
 * @return {void} This function does not return a value.
 */
function openEditDeleteMenu() {
  document.getElementById("editDeleteButtonContainer").classList.remove("d_none");
  event.stopPropagation();
}

/**
 * Sets the source of the specified image element to a blue version of the source snippet.
 *
 * @param {string} imageID - The ID of the image element to update.
 * @param {string} sourceSnippet - The source snippet to use for the updated image.
 */
function turnBlue(imageID, sourceSnippet) {
  document.getElementById(`${imageID}`).src = `../assets/img/icons/${sourceSnippet}`;
}

/**
 * Sets the source of the specified image element to a black version of the source snippet.
 *
 * @param {string} imageID - The ID of the image element to update.
 * @param {string} sourceSnippet - The source snippet to use for the updated image.
 */
function turnBlack(imageID, sourceSnippet) {
  document.getElementById(`${imageID}`).src = `../assets/img/icons/${sourceSnippet}`;
}

/**
 * Sorts the contacts array in ascending order based on the contactName property.
 *
 * @return {void} This function does not return a value.
 */
function sortContactsByName() {
  if(contacts !== null) {
    contacts.sort(function (a, b) {
      if (a.contactName < b.contactName) {
        return -1;
      }
      if (a.contactName > b.contactName) {
        return 1;
      }
      return 0;
    });
  }
}

/**
 * Creates an array of unique starting letters from the names of contacts and sorts them alphabetically.
 *
 * @return {void} This function does not return a value.
 */
function createStartingLetters() {
  if(contacts !== null) {
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      sortedStartingLetters.push(contact.userName[0]);
    }
    uniqueStartingLetters = [...new Set(sortedStartingLetters)];
    uniqueStartingLetters.sort();
    sortedStartingLetters = [];
  }
}

/**
 * Deletes a contact at the specified index, updates the contact list, and handles UI interactions accordingly.
 *
 * @param {number} i - The index of the contact to delete.
 * @return {Promise<void>} A promise that resolves after the contact has been successfully deleted.
 */
async function deleteContact(i) {
  await deleteContactFromTasks(i);
  contacts.splice(i, 1);
  document.getElementById("edit-contact-form").reset();
  await storeContacts();
  closeEditContact();
  showSnackbar("Contact successfully deleted");
  if (i == 0) {
    displayContactDetails(i);
    displayContacts();
    toggleActiveContact(i);
  } else {
    displayContactDetails(i - 1);
    displayContacts();
    toggleActiveContact(i - 1);
  }
}

/**
 * Deletes a contact from all tasks if it is assigned to any task.
 *
 * @param {number} i - The index of the contact to delete.
 * @return {Promise<void>} A promise that resolves after the contact has been deleted from all tasks.
 */
async function deleteContactFromTasks(i) {
  await loadAllTasksContacts();
  for (let index = 0; index < tasks.length; index++) {
    const task = tasks[index];
    if (task.assignedTo.length != 0) {
      await checkIfContactAssigned(task, i);
    }
  }
}

/**
 * Checks the task, the contact is assigned to and removes it from this tasks.
 *
 * @param {Object} task - The task object to check.
 * @param {number} i - The index of the contact in the contacts array.
 * @return {Promise<void>} A promise that resolves after the contact has been removed from the task's assignedTo array, if it was assigned.
 */
async function checkIfContactAssigned(task, i) {
  for (let j = 0; j < task.assignedTo.length; j++) {
    const assignedContact = task.assignedTo[j];
    if (assignedContact.userName == contacts[i].userName) {
      let contactIndex = task.assignedTo.indexOf(assignedContact);
      task.assignedTo.splice(contactIndex, 1);
      await storeAllTasksContacts();
      initContacts();
    }
  }
}

/**
 * Asynchronously stores all tasks in the "remoteTasks" storage.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are stored.
 */
async function storeAllTasksContacts() {
  await setItem("remoteTasks", tasks);
}

/**
 * Deletes a contact from the overview and updates the contact list and UI accordingly.
 *
 * @param {number} i - The index of the contact to delete.
 * @return {Promise<void>} A promise that resolves after the contact has been deleted.
 */
async function deleteContactInOverview(i) {
  await deleteContactFromTasks(i);
  contacts.splice(i, 1);
  await storeContacts();
  showSnackbar("Contact successfully deleted");
  if (i == 0) {
    displayContactDetails(i);
    displayContacts();
    toggleActiveContact(i);
  } else {
    displayContactDetails(i - 1);
    displayContacts();
    toggleActiveContact(i - 1);
  }
}

/**
 * Displays a snackbar message on the screen with the given message.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 * @return {void} This function does not return a value.
 */
function showSnackbar(message) {
  let snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.innerHTML = message;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}