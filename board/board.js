let todo = [];
let inProgress = [];
let awaitFeedback = [];
let done = [];
let matchingTodos = [];
const CATEGORY_COLORS = { "Technical Task": "#1FD7C1", "User Story": "#0038FF" };
const PRIO_IMAGE_URLS = {
  low: "../assets/img/icons/prio_kow_green.svg",
  medium: "../assets/img/icons/prio_medium_orange.svg",
  urgent: "../assets/img/icons/prio_urgent_red.svg",
};
let currentDraggedElement;

/**
 * Initializes the board by loading all tasks, updating the HTML display, 
 * unlogging all sidebar links, logging the board sidebar link, and loading user initials.
 *
 * @return {Promise<void>} A promise that resolves when the board is successfully initialized.
 */
async function initBoard() {
  await loadAllTasks();
  await updateHTML(allTasks);
  await loadContacts();
  unlogAllSidebarLinks();
  logSidebarLink("boardSidebar");
  setTimeout(() => {
    loadUserInitials();
  }, 500);
}

/**
 * Updates the HTML display based on the tasks' status in the given array.
 *
 * @param {Array} arrayName - The array of tasks to update the HTML display from.
 * @return {Promise<void>} A promise that resolves when the HTML display is successfully updated.
 */
async function updateHTML(arrayName) {
  if (arrayName !== null) {
    todo = arrayName.filter((t) => t["status"] == "todo");
    inProgress = arrayName.filter((t) => t["status"] == "in-progress");
    awaitFeedback = arrayName.filter((t) => t["status"] == "await-feedback");
    done = arrayName.filter((t) => t["status"] == "done");

    updateArea("todo", todo, arrayName);
    updateArea("in-progress", inProgress, arrayName);
    updateArea("await-feedback", awaitFeedback, arrayName);
    updateArea("done", done, arrayName);
  }
}

/**
 * Updates the HTML display of a specific area based on the tasks' status in the given array.
 *
 * @param {string} areaName - The ID of the HTML element representing the area.
 * @param {Array} areaArray - The array of tasks to update the HTML display from.
 * @param {Array} arrayName - The array of all tasks.
 * @return {void} This function does not return anything.
 */
function updateArea(areaName, areaArray, arrayName) {
  document.getElementById(areaName).innerHTML = "";
  if (areaArray.length == 0) {
    document.getElementById(areaName).innerHTML += generateEmptyHTML();
  } else {
    for (let index = 0; index < areaArray.length; index++) {
      const element = areaArray[index];
      document.getElementById(areaName).innerHTML += generateTodoHTML(element, arrayName);
      document.getElementById(`prio-image${arrayName.indexOf(element)}`).innerHTML += generatePrioImage(element, arrayName);
      createInitials(element, arrayName);
      if (element.subtasks != null) {
        document.getElementById(`subtask-progress${arrayName.indexOf(element)}`).style.display = "flex";
      }
    }
  }
}

/**
 * Generates the HTML content for a single task element.
 *
 * @param {Object} element - The task object to generate HTML for.
 * @param {Array} arrayName - The array of all tasks.
 * @return {string} The HTML content for the task element.
 */
function generateTodoHTML(element, arrayName) {
  return /*html*/ `
        <div draggable="true" ondragstart="startDragging(${arrayName.indexOf(element)}); highlightAreas()" ondragend="removeHighlightAreas()" class="task" id="task${arrayName.indexOf(
    element
  )}" onclick="openTaskDetails(${arrayName.indexOf(element)})">
            <span class="task-category" style="background-color: ${CATEGORY_COLORS[element.category]}">${element["category"]}</span>
            <span class="task-title">${element["title"]}</span>
            <span class="task-description">${element["description"]}</span>
            <!-- if there are no subtasks, the progress-bar should not be displayed -->
            <div class="subtask-progress" id="subtask-progress${arrayName.indexOf(element)}" style="display: none">
                <progress class="progress-bar" value="${calculateSubtaskProgress(element)}" max="100"></progress>
                <span>${checkSubtaskStatus(element)}/${element.subtasks ? element.subtasks.length : ''} Subtasks</span>
            </div>
            <div class="user-and-prio">
                <div class="assigned-to" id="assigned-to${arrayName.indexOf(element)}"></div>
                <div id="prio-image${arrayName.indexOf(element)}"></div>
            </div>
        </div>
    `;
}

/**
 * Starts the dragging process for a card with the given ID.
 *
 * @param {number} id - The ID of the card to start dragging.
 * @return {void} This function does not return anything.
 */
function startDragging(id) {
  currentDraggedElement = id;
  dragCardHighlight(currentDraggedElement);
}

/**
 * Generates the initials of the assigned users for a given element and updates the HTML display.
 *
 * @param {Object} element - The element containing the assigned users.
 * @param {Array} arrayName - The array of all elements.
 * @return {void} This function does not return anything.
 */
function createInitials(element, arrayName) {
  if (element["assignedTo"] == null) {
    return "";
  } else {
    for (let i = 0; i < element.assignedTo.length; i++) {
      document.getElementById(`assigned-to${arrayName.indexOf(element)}`).innerHTML += /*html*/ `
                <span class="assigned-user" style="background-color: ${element.assignedTo[i].contactColor}">${element.assignedTo[i].contactInitials}</span>
      `;
    }
  }
}

/**
 * Generates the priority image HTML content for a given element.
 *
 * @param {Object} element - The element for which the priority image is generated.
 * @param {Array} arrayName - The array of all elements.
 * @return {string} The HTML content for the priority image.
 */
function generatePrioImage(element, arrayName) {
  let imageContainer = document.getElementById(`prio-image${arrayName.indexOf(element)}`);
  if (element["priority"] == undefined) {
    imageContainer.style.display = "none";
  } else {
    return /*html*/ `
            <img src="${PRIO_IMAGE_URLS[element.priority]}" alt="">
        `;
  }
}

/**
 * Calculates the number of subtasks that are marked as "done" for a given task element.
 *
 * @param {Object} element - The task element to check subtask status for.
 * @return {number} The count of subtasks that are marked as "done".
 */
function checkSubtaskStatus(element) {
  if (element.subtasks != null) {
    let subtasksDone = 0;
    element.subtasks.forEach((subtask) => {
      if (subtask.statusSubtask == "done") {
        subtasksDone++;
      }
    });
    return subtasksDone;
  }
}

/**
 * Calculates the subtask progress for a given element.
 *
 * @param {Object} element - The task element to calculate subtask progress for.
 * @return {number} The calculated progress percentage.
 */
function calculateSubtaskProgress(element) {
  if (element.subtasks != null) {
    let substasksDone = checkSubtaskStatus(element);
    let progress = (substasksDone / element.subtasks.length) * 100;
    return progress;
  }
}

/**
 * Generates the HTML content for a "no tasks" message.
 *
 * @return {string} The HTML content for the "no tasks" message.
 */
function generateEmptyHTML() {
  return `<div class="task no-task">No tasks here</div>`;
}

/**
 * Prevents the default behavior of the browser when an element is being dragged over a drop target.
 *
 * @param {DragEvent} event - The event object representing the drag and drop event.
 * @return {void} This function does not return a value.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Moves the current dragged element to the specified status.
 *
 * @param {string} status - The status to move the dragged element to.
 * @return {Promise<void>} A promise that resolves when the move is complete.
 */
async function moveTo(status) {
  allTasks[currentDraggedElement]["status"] = status;
  await storeAllTasksBoard();
  await loadAllTasks();
  updateHTML(allTasks);
  setTimeout(() => {
    // add loading spinner
    location.reload();
  }, 500);
}

/**
 * Adds the "drag-area-highlight" class to the element with the specified ID.
 *
 * @param {string} id - The ID of the element to highlight.
 * @return {void} This function does not return a value.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Highlights all drag areas on the page by adding the "drag-area-highlight" class.
 *
 * @return {void} This function does not return a value.
 */
function highlightAreas() {
  let dragAreas = document.getElementsByClassName("drag-area");
  for (let i = 0; i < dragAreas.length; i++) {
    dragAreas[i].classList.add("drag-area-highlight");
  }
}

/**
 * Removes the "drag-area-highlight" class from all elements with the class "drag-area".
 *
 * @return {void} This function does not return a value.
 */
function removeHighlightAreas() {
  let dragAreas = document.getElementsByClassName("drag-area");
  for (let i = 0; i < dragAreas.length; i++) {
    dragAreas[i].classList.remove("drag-area-highlight");
  }
}

/**
 * Removes the "drag-area-highlight" class from the element with the specified ID.
 *
 * @param {string} id - The ID of the element to remove highlight from.
 * @return {void} This function does not return a value.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

/**
 * Highlights the card element being dragged by adding the "on-drag-highlight" class.
 *
 * @param {number} currentDraggedElement - The ID of the card element being dragged.
 * @return {void} This function does not return a value.
 */
function dragCardHighlight(currentDraggedElement) {
  document.getElementById(`task${currentDraggedElement}`).classList.add("on-drag-highlight");
}

/**
 * Asynchronously stores all tasks in the tasks key of the remote storage.
 *
 * @return {Promise<void>} A promise that resolves when the tasks are successfully stored.
 */
async function storeAllTasksBoard() {
  await setItem(`users/${getUserIndex()}/userTasks`, allTasks);
}

/**
 * Opens the add task popup and initializes the necessary data.
 *
 * @return {Promise<void>} A promise that resolves when the add task popup is fully initialized.
 */
async function openAddTask() {
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  clearForm();
  await loadAllTasks();
  await loadContacts();
  renderContactsToAssign();
  renderCategories();
  setPrioMedium();
}

/**
 * Closes the modal by setting the width and left properties of the modal background element to 0 and 100% respectively.
 * Sets the overflow property of the body element to "auto".
 * Asynchronously calls the redoChangesToTaskForm and initBoard functions.
 *
 * @return {Promise<void>} A promise that resolves when the modal is closed and the necessary functions are called.
 */
async function closeModal() {
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = 0;
  modalBg.style.left = "100%";
  document.getElementById("body").style.overflow = "auto";
  document.getElementById('searchfield').value = "";
  await redoChangesToTaskForm();
  initBoard();
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", async function (event) {
  let modalBg = document.getElementById("modal-bg");
  if (event.target == modalBg) {
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
    document.getElementById("body").style.overflow = "auto";
    document.getElementById('searchfield').value = "";
    await redoChangesToTaskForm();
    await initBoard();
  }
});

/**
 * Opens the add task popup via the according status and initializes the necessary data.
 * The status is automatically set to the status of the area.
 *
 * @param {string} status - The status to set.
 * @return {Promise<void>} A promise that resolves when the add task popup is fully initialized.
 */
async function openAddTaskAndSetStatus(status) {
  document.getElementById("body").style.overflow = "hidden";
  let modalBg = document.getElementById("modal-bg");
  modalBg.style.width = "100%";
  modalBg.style.left = 0;
  await loadAllTasks();
  await loadContacts();
  renderContactsToAssign();
  renderCategories();
  localStorage.setItem("status", status);
  setPrioMedium();
}

/**
 * Displays a snackbar message on the board with the given message.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 * @return {Promise<void>} A promise that resolves when the snackbar is hidden after 2.5 seconds.
 */
async function showSnackbarBoard(message) {
  let snackbarBoard = document.getElementById("snackbar-board");
  snackbarBoard.className = "show";
  snackbarBoard.innerHTML = message;
  setTimeout(function () {
    snackbarBoard.className = snackbarBoard.className.replace("show", "");
  }, 2500);
}