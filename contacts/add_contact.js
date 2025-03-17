/**
 * Opens the add contact modal and resets the form.
 *
 * @return {void} 
 */
function openAddContact() {
    let modal = document.getElementById("modal-bg-add");
    modal.style.width = "100%";
    modal.style.left = 0;
    document.getElementById("add-contact-form").reset();
}

/**
 * Adds a new contact to the contacts array, stores it, closes the add contact modal,
 * displays a success message, displays the updated contacts list, displays the details of the
 * newly added contact, toggles the active contact, and scrolls to the newly added contact.
 *
 * @return {Promise<void>} A promise that resolves when the contact is successfully added.
 */
async function addContact() {
    let contact = await createContactObject();
    contacts.push(contact);
    await storeContacts();
    closeAddContact();
    showSnackbar("Contact successfully created");
    displayContacts();
    displayContactDetails(contacts.indexOf(contact));
    toggleActiveContact(contacts.indexOf(contact));
    document.getElementById(`contact${contacts.indexOf(contact)}`).scrollIntoView();
}

/**
 * Creates a contact object with the provided information.
 *
 * @param {string} contactName - The name of the contact.
 * @param {string} contactMail - The email of the contact.
 * @param {string} contactPhone - The phone number of the contact.
 * @return {Object} The created contact object.
 */
async function createContactObject() {
    let contactName = document.getElementById("name-input");
    let contactMail = document.getElementById("mail-input");
 
    let contactInitials = createContactInitials(contactName.value);
    let contactColor = createContactColor();

    let contact = {
        userName: contactName.value,
        userEmail: contactMail.value,
        userInitials: contactInitials,
        userColor: contactColor,
    };
    return contact;
}


/**
 * Generates the initials of a given contact name.
 *
 * @param {string} contactName - The name of the contact.
 * @return {string} The first two initials of the contact name.
 */
function createContactInitials(contactName) {
    let contactAsString = contactName.toString();
    let initials = contactAsString.match(/\b(\w)/g).join("");
    let firstTwoInitials = initials.slice(0, 2);
    return firstTwoInitials;
}

/**
 * Generates a random color for the contact from the predefined contact colors array.
 *
 * @return {string} The randomly generated color.
 */
function createContactColor() {
    let color = contactColors[generateRandomNumber()];
    return color;
}

/**
 * Generates a random number between 0 and 14.
 *
 * @return {number} The generated random number.
 */
function generateRandomNumber() {
    return Math.floor(Math.random() * 15);
}

/**
 * Renders an error message if the name input is empty, otherwise adds a contact.
 *
 * @param {string} id - The id of the element to render the error message.
 * @return {void} This function does not return a value.
 */
function renderErrorOrAddContact(id) {
    if (document.getElementById("name-input").value == "") {
        renderError(id);
    } else {
        addContact();
    }
}

/**
 * Asynchronously stores the contacts array in the "remoteContacts" storage.
 *
 * @return {Promise<void>} A promise that resolves when the contacts are stored.
 */
async function storeContacts() {
    setItem(`users/${getUserIndex()}/contacts`, contacts);
}

/**
 * Closes the add contact modal by setting its width to 0 and its left position to "100%".
 *
 * @return {void} This function does not return a value.
 */
function closeAddContact() {
    let modal = document.getElementById("modal-bg-add");
    modal.style.width = 0;
    modal.style.left = "100%";
}

// Close modal when user clicks outside of it
window.addEventListener("click", function (event) {
    let modalBg = document.getElementById("modal-bg-add");
    if (event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = "100%";
    }
});