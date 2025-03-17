let allTasks = [];
let priority;
let categories = ["Technical Task", "User Story"];
let assignedContacts = [];
let subtasks = [];

/**
 * Initializes the page by including HTML, loading all tasks, loading contacts, rendering contacts to assign,
 * rendering categories, showing assigned contacts, unlogging all sidebar links, logging the "addTaskSidebar" link,
 * setting the priority to medium, and loading the user's initials.
 *
 * @return {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
  includeHTML();
  await loadAllTasks();
  await loadContacts();
  await renderContactsToAssign();
  renderCategories();
  showAssignedtoContacts();
  unlogAllSidebarLinks();
  logSidebarLink("addTaskSidebar");
  setPrioMedium();
  await loadUserInitials();
}

/**
 * Loads all tasks from the "remoteTasks" storage and parses the response.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are loaded and parsed.
 */
async function loadAllTasks() {
  let userIndex = getUserIndex();
  remoteTasks = await getItem(`users/${userIndex}/userTasks`);
  if(remoteTasks != null) {
    allTasks = remoteTasks;
  }
}

function getUserIndex() {
  return localStorage.getItem("userIndex");
}

/**
 * Asynchronously stores all tasks in the "remoteTasks" storage.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are stored.
 */
async function storeAllTasks() {
  let userIndex = getUserIndex();
  await setItem(`users/${userIndex}/userTasks`, allTasks);
}

/**
 * Creates a task object with the values from the input fields and adds it to the task list.
 *
 * @return {Promise<void>} - A promise that resolves when the task is added to the list.
 */
async function createTask() {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let dueDate = document.getElementById("taskDueDate").value;
  let category = document.getElementById("buttonName").textContent;
  let status = "todo";
  if (localStorage.getItem("status")) {
    status = localStorage.getItem("status");
  }

  let task = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    assignedTo: assignedContacts,
    category: category,
    subtasks: subtasks,
    status: status,
  };
  addTask(task);
  if (localStorage.getItem("status")) {
    localStorage.removeItem("status");
  }
}

/**
 * Adds a task to the task list and performs related actions.
 *
 * @param {Object} task - The task object to be added.
 * @return {Promise<void>} - A promise that resolves when the task is added to the list.
 */
async function addTask(task) {
  document.getElementById("submit_task_button").setAttribute("disabled", true);
  await loadAllTasks();
  await loadContacts();
  pushTask(task);
  await storeAllTasks();
  showSnackbarAddTasks("Task added to board");
  clearForm();
  setTimeout(() => {
    redirectToBoard();
  }, 2000);
}

/**
 * Adds a task to the allTasks array.
 *
 * @param {Object} task - The task object to be added.
 */
function pushTask(task) {
  allTasks.push(task);
}

/**
 * Clears the task form and associated elements, resets button text, removes priorities, and renders contacts with checkboxes.
 *
 * @return {void} This function does not return anything.
 */
function clearForm() {
  document.getElementById("taskForm").reset();
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  document.getElementById("buttonName").textContent = "Select task Category";
  removeUrgentPrio();
  removeMediumPrio();
  removeLowPrio();
  setPrioMedium();
  clearArrays();
  renderContactsToAssignWithemptyCheckbox();
  turnDateColorGrey();
  setPrioMedium();
}

/**
 * Clears the assignedContacts, priority, and subtasks arrays.
 *
 * @return {void} This function does not return anything.
 */
function clearArrays() {
  assignedContacts = [];
  priority = "";
  subtasks = [];
}

/**
 * Redirects the user to the board page after a delay of 3 seconds.
 *
 * @param {string} targetUrl - The URL of the board page.
 * @return {void} This function does not return a value.
 */
function redirectToBoard() {
  const targetUrl = "../board/board.html";
  window.location.href = targetUrl;
  
}

/**
 * Sets the source of the "clearButtonImage" element to the bright version of the addTask_x icon.
 *
 * @return {void} This function does not return a value.
 */
function makeIconClearButtonBright() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_bright.png";
}

/**
 * Sets the source of the "clearButtonImage" element to the dark version of the addTask_x icon.
 *
 * @param {type} None - No parameters needed.
 * @return {type} None - No return value.
 */
function makeIconClearButtonDark() {
  document.getElementById("clearButtonImage").src = "../assets/img/icons/addTask_x_dark.png";
}

/**
 * Changes the color of the task due date to black by removing the 'date' class and adding the 'date_after_change' class.
 *
 * @return {undefined} This function does not return a value.
 */
function turnDateColorBlack() {
  document.getElementById("taskDueDate").classList.remove("date");
  document.getElementById("taskDueDate").classList.add("date_after_change");
}

/**
 * Sets the color of the "taskDueDate" element to grey by adding the "date" class and removing the "date_after_change" class.
 *
 * @return {void} This function does not return a value.
 */
function turnDateColorGrey() {
  document.getElementById("taskDueDate").classList.add("date");
  document.getElementById("taskDueDate").classList.remove("date_after_change");
}

/**
 * Checks if the required fields in the task form are filled. If any of the fields are empty,
 * it applies red border and shows error messages. If all fields are filled, it enables the
 * submit button and calls the createTask function.
 *
 * @return {void} This function does not return a value.
 */
function checkRequiredFields() {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    borderRedIfTitleEmpty();
    borderRedIfDateEmpty();
    borderRedIfCategoryEmpty();
  } else {
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
    createTask();
    document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark");
  }
}

/**
 * Toggles the disabled state of the submit task button based on the values of the task title, task due date, and selected task category fields.
 *
 * @return {void} This function does not return a value.
 */
function disOrEnableButton() {
  if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("submit_task_button").classList.add("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.remove("btn_dark");
  } else {
    document.getElementById("submit_task_button").classList.remove("btn_dark_disabled");
    document.getElementById("submit_task_button").classList.add("btn_dark");
  }
}

/**
 * Toggles the visibility of the dropdown menu for assigned to contacts.
 *
 * @return {void} This function does not return anything.
 */
function toggleDropdownAssignedTo() {
  document.getElementById("assignedToDropdown").classList.toggle("show");
}

/**
 * Renders the contacts to assign in the "assignedToDropdown" element.
 *
 * @return {Promise<void>} A promise that resolves when the rendering is complete.
 */
async function renderContactsToAssign() {
  document.getElementById("assignedToDropdown").innerHTML = "";
  if(contacts) {
    for (let i = 0; i < contacts.length; i++) {
      document.getElementById("assignedToDropdown").innerHTML += generateContactToAssign(i);
      addCheckboxImage(i);
    }
  }
}

/**
 * Renders the contacts to assign with an empty checkbox for each contact.
 *
 * @return {void} This function does not return anything.
 */
function renderContactsToAssignWithemptyCheckbox() {
  if(contacts !== null) {
    document.getElementById("assignedToDropdown").innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
      document.getElementById("assignedToDropdown").innerHTML += generateContactToAssign(i);
      emptyCheckboxImage(i);
    }
  }
}

/**
 * Generates the HTML code for a contact to be assigned.
 *
 * @param {number} i - The index of the contact in the contacts array.
 * @return {string} The generated HTML code for the contact.
 */
function generateContactToAssign(i) {
  return `<div class="dropdown-content-div" onclick="selectAssignedContact(${i}), stopPropagation()">
    <div class="dropdown_container">
      <div  style="background-color:${contacts[i].userColor}" class="initials_circle"><span class="initials_span">${contacts[i].userInitials}</span></div>
      <span id="contacts${i}">${contacts[i].userName}</span>
    </div>
    <div id="checkboxContainer${i}"><img id="checkBoxImage${i}" src="../assets/img/icons/checkbox_empty.png" alt=""></div>
  </div>`;
}

/**
 * Toggles the visibility of the dropdown menu for task categories.
 *
 * @return {void} This function does not return anything.
 */
function toggleDropdownCategory() {
  document.getElementById("categoryDropdown").classList.toggle("show");
}

/**
 * Renders the categories in the "categoryDropdown" element.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function renderCategories() {
  document.getElementById("categoryDropdown").innerHTML = "";
  for (let i = 0; i < categories.length; i++) {
    document.getElementById("categoryDropdown").innerHTML += generateCategories(i);
  }
}

/**
 * Generates the HTML code for a category dropdown item.
 *
 * @param {number} i - The index of the category in the categories array.
 * @return {string} The generated HTML code for the category dropdown item.
 */
function generateCategories(i) {
  return `
    <div class="dropdown-content-div" onclick="selectCategory(${i})">
      <div id='categoryName' class="dropdown_container">${categories[i]}</div>
    </div>
  `;
}

/**
 * Updates the category button with the selected category and toggles the dropdown category.
 *
 * @param {number} i - The index of the selected category.
 * @return {void} This function does not return a value.
 */
function selectCategory(i) {
  document.getElementById("categoryButton").innerHTML = `
  <span id="buttonName">${categories[i]}</span>
  <img onclick="event.stopPropagation(); toggleDropdownCategory()" class="dropdown_arrow" src="../assets/img/icons/arrow_down_dropdown.png"/>`;
  borderRedIfCategoryEmpty();
}

/**
 * Adds a checkbox image for a contact based on the comparison of contact mails.
 *
 * @param {number} j - The index of the contact.
 * @return {void} This function does not return a value.
 */
function addCheckboxImage(j) {
  for (let i = 0; i < assignedContacts.length; i++) {
    const assContact = assignedContacts[i];
    const contact = contacts[j];

    if (assContact.contactMail == contact.contactMail) {
      document.getElementById(`checkBoxImage${j}`).src = "../assets/img/icons/checkbox_filled.png";
    }
  }
}

/**
 * Handles the selection of an assigned contact.
 *
 * @param {number} i - The index of the selected contact.
 * @return {Promise<void>} A promise that resolves when the selection process is complete.
 */
async function selectAssignedContact(i) {
  if (document.getElementById(`checkBoxImage${i}`).src.endsWith("/checkbox_filled.png")) {
    document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
    let currentContact = contacts[i];
    for (let j = 0; j < assignedContacts.length; j++) {
      let assignedContact = assignedContacts[j];
      if (assignedContact.userEmail == currentContact.userEmail) {
        assignedContacts.splice(j, 1);
      }
    }
  } else {
    fillCheckboxImage(i);
    pushAssignedContacts(i);
  }
  showAssignedtoContacts();
}

/**
 * Sets the source of the checkbox image to the filled checkbox icon.
 *
 * @param {number} i - The index of the checkbox image.
 * @return {undefined} This function does not return a value.
 */
function fillCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_filled.png";
}

/**
 * Sets the source of the checkbox image to the empty checkbox icon.
 *
 * @param {number} i - The index of the checkbox image.
 * @return {void} This function does not return anything.
 */
function emptyCheckboxImage(i) {
  document.getElementById(`checkBoxImage${i}`).src = "../assets/img/icons/checkbox_empty.png";
}

/**
 * Pushes the contact at index `i` from the `contacts` array into the `assignedContacts` array.
 *
 * @param {number} i - The index of the contact in the `contacts` array.
 * @return {void} This function does not return a value.
 */
function pushAssignedContacts(i) {
  let assignedContact = contacts[i];
  assignedContacts.push(assignedContact);
}

/**
 * A function that stops the propagation of the event.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
function stopPropagation() {
  event.stopPropagation(onclick);
}

/**
 * Renders the assigned contacts in the "assignedtoContactsContainer" element.
 *
 * @return {void} This function does not return anything.
 */
function showAssignedtoContacts() {
  document.getElementById("assignedtoContactsContainer").innerHTML = "";
  for (let i = 0; i < assignedContacts.length; i++) {
    let assignedContact = assignedContacts[i];
    let foundIndex = -1;
    for (let j = 0; j < contacts.length; j++) {
      if (contacts[j].userName === assignedContact.userName) {
        foundIndex = j;
        break;
      }
    }
    if (foundIndex !== -1) {
      document.getElementById("assignedtoContactsContainer").innerHTML += generateInitialCircles(foundIndex);
    }
  }
}

/**
 * Generates the HTML code for an initial circle element.
 *
 * @param {number} i - The index of the contact in the contacts array.
 * @return {string} The generated HTML code for the initial circle element.
 */
function generateInitialCircles(i) {
  return `
  <div id="initialCircle${i}" style="background-color:${contacts[i].userColor}" class="initials_circle"><span class="initials_span">${contacts[i].userInitials}</span></div>
  `;
}
