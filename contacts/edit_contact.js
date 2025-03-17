/**
 * Opens the edit contact modal and generates the modal content for the specified contact index.
 *
 * @param {number} i - The index of the contact to edit.
 * @return {void} This function does not return a value.
 */
function openEditContact(i) {
    setModalSizeAndPosition();
    generateModalContent(i);
}

/**
 * Sets the size and position of the modal.
 *
 * @param {none} 
 * @return {none} 
 */
function setModalSizeAndPosition() {
    let modal = document.getElementById("modal-bg-edit");
    modal.style.width = "100%";
    modal.style.left = 0;
}

/**
 * Generates the content for the modal window used to edit a contact.
 *
 * @param {number} i - The index of the contact to edit.
 * @return {void} This function does not return anything.
 */
function generateModalContent(i) {
    let container = document.getElementById("form-and-image-edit");
    container.innerHTML = /*html*/ `
        <div style="background-color: ${contacts[i].userColor}" class="initials_circle initials_circle_big margin_right inicials_circle_edit_contact_mobile"><span class="initials_span">${contacts[i].userInitials}</span></div>
        <div class="form_container">
            <form action="" class="add-contact-form" id="edit-contact-form" onsubmit="event.preventDefault(); editContact(${i})">
            <div class="contact_input_container">

                <input  class="newContactName" type="text" name="name" id="name-input-edit" placeholder="Name" value="${contacts[i].userName}" onkeyup="checkIfInputHasValue()">
                <input class="newContactEmail" type="email" name="email" id="mail-input-edit" placeholder="Email" value="${contacts[i].userEmail}">
            </div>
            <div class="cancel-and-create-buttons">
                <button class="btn_bright" onclick="deleteContact(${i}); event.preventDefault()">Delete
                </button>
                <button class="btn_dark" type="submit">Save
                <img src="../assets/img/icons/white_check.svg" alt="">
                </button>
            </div>
            <div id="errorContainerEditContacts">
            </div>
            </form>
        </div>
    `;
}

/**
 * Edits a contact by updating its name, email, and phone number. If the name input is empty,
 * an error is rendered. The updated contact is stored in local storage, the edit contact modal
 * is closed, a success message is displayed, the contact details are re-displayed, the contact
 * list is re-rendered, and the active contact is toggled.
 *
 * @param {number} i - The index of the contact to edit in the contacts array.
 * @return {Promise<void>} A promise that resolves when the contact has been edited and stored.
 */
async function editContact(i) {
    if (document.getElementById("name-input-edit").value == "") {
        renderError("errorContainerEditContacts");
    } else {
        contacts[i].userName = document.getElementById("name-input-edit").value;
        contacts[i].userEmail = document.getElementById("mail-input-edit").value;
        // contacts[i].contactPhone = document.getElementById("phonenumber-input-edit").value;
        await storeContacts();
        closeEditContact();
        showSnackbar("Contact infos successfully changed");
        displayContactDetails(i);
        displayContacts();
        toggleActiveContact(i);
    }
}

/**
 * Renders an error message with a specific text in the element with the provided id.
 *
 * @param {string} id - The id of the element where the error message will be rendered.
 * @return {void} This function does not return a value.
 */
function renderError(id) {
    document.getElementById(id).innerHTML = `
      Please add your name. Email and phone are optional.
      `;
}

/**
 * Removes the error message from the "errorContainerContacts" element.
 *
 * @return {void} This function does not return a value.
 */
function removeError() {
    document.getElementById("errorContainerContacts").innerHTML = ``;
}

/**
 * Checks if the "name-input" element has a value and calls the removeError function if it is not empty.
 *
 * @return {void} This function does not return a value.
 */
function checkIfInputHasValue() {
    if (document.getElementById("name-input").value !== "") {
        removeError();
    }
}

/**
 * Closes the edit contact modal by setting its width to 0 and its left position to "100%".
 *
 * @return {void} This function does not return a value.
 */
function closeEditContact() {
    let modal = document.getElementById("modal-bg-edit");
    modal.style.width = 0;
    modal.style.left = "100%";
}

window.addEventListener("click", function (event) {
    let modalBg = document.getElementById("modal-bg-edit");
    if (event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = "100%";
    }
});