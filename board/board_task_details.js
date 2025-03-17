/**
 * Opens the task details modal and displays the details of the task at the given index.
 *
 * @param {number} index - The index of the task in the allTasks array.
 * @return {void} This function does not return anything.
 */
function openTaskDetails(index) {
    document.getElementById("body").style.overflow = "hidden";
    let modalBg = document.getElementById("modal-bg-details");
    modalBg.style.width = "100%";
    modalBg.style.left = 0;
    let taskDetailsContainer = document.getElementById("task-details");
    taskDetailsContainer.innerHTML = "";
    taskDetailsContainer.innerHTML += createTaskDetailsHtml(index);
    displayAssignedContacts(allTasks[index]);
    displaySubstasks(allTasks[index]);
}

/**
 * Generates the HTML for the task details modal.
 *
 * @param {number} index - The index of the task in the allTasks array.
 * @return {string} The HTML for the task details modal.
 */
function createTaskDetailsHtml(index) {
    let task = allTasks[index];
    return /*html*/ `
          <div class="details-top">
              <span class="task-category" style="background-color: ${CATEGORY_COLORS[task.category]}">${task.category}</span>
              <span id="close-modal" class="close-modal" onclick="closeModalDetails()">&times;</span>
          </div>
          <div class="details-bottom">
              <h1 class="details-h1">${task.title}</h1>
              <div class="description-container">
                <p>Description: </p>
                <p>${task.description}</p>
              </div>
              <div class="due-date">
                  <p>Due date:</p>
                  <p>${task.dueDate}</p>
              </div>
              <div class="priority-container">
                  <p>Priority:</p>
                  <div class="priority">
                      <p>${task.priority}</p>
                      <p>${generatePrioImage(task, allTasks)}</p>
                  </div>
              </div>
              <div class="assigned-to-container">
                  <p>Assigned to:</p>
                  <div class="assigned-to-contacts" id="assigned-to-contacts"></div>
              </div>
              <div class="subtasks-container">
                  <p class="subtasks-p" style="margin-block-end: 0.2em;">Subtasks:</p>
                  <div class="subtasks" id="subtasks"></div>
              </div>
              <div class="edit-and-delete-buttons">
                  <button onclick="deleteTask(${index})" onmouseover="turnBlue('delete-image', 'delete_blue.svg')" onmouseleave="turnBlack('delete-image', 'delete.svg')"><img src="../assets/img/icons/delete.svg" alt="" id="delete-image">Delete</button>
                  <img class="tiny_line_board" src="../assets/img/icons/tiny_line.png" alt="" style="height: fit-content;">
                  <button onclick="openEditTask(${index})" onmouseover="turnBlue('edit-image', 'edit_blue.svg')" onmouseleave="turnBlack('edit-image', 'edit.svg')"><img src="../assets/img/icons/edit.svg" alt="" id="edit-image">Edit</button>
              </div>
          </div>
      `;
}

/**
 * Renders the subtasks of a given task onto the webpage.
 *
 * @param {Object} task - The task object containing subtasks to display.
 * @return {void} This function does not return anything.
 */
function displaySubstasks(task) {
    let subtasksContainer = document.getElementById("subtasks");
    subtasksContainer.innerHTML = "";
    if (task["subtasks"]) {
      for (let i = 0; i < task["subtasks"].length; i++) {
        const subtask = task["subtasks"][i];
        if (subtask.statusSubtask == "inProgress") {
          subtasksContainer.innerHTML += /*html*/ `
                    <div class="subtask">
                        <img src="../assets/img/icons/check_box_empty.png" alt="" onclick="toggleCheckbox(${i}, ${allTasks.indexOf(task)})" id="subtask-checkbox${i}" style="width: 20px; height: 20px">
                        <p class="subtask-text">${subtask.nameSubtask}</p>
                    </div>
                `;
        } else {
          subtasksContainer.innerHTML += /*html*/ `
                    <div class="subtask">
                        <img src="../assets/img/icons/checkbox_filled.png" alt="" id="checkbox-filled${i}" onclick="toggleCheckbox(${i}, ${allTasks.indexOf(task)})" style="width: 20px; height: 20px">
                        <p class="subtask-text">${subtask.nameSubtask}</p>
                    </div>
                `;
        }
      }
    }
  }

/**
 * Toggles the status of a subtask checkbox and updates the task's subtasks array.
 *
 * @param {number} i - The index of the subtask in the subtasks array.
 * @param {number} taskIndex - The index of the task in the allTasks array.
 * @return {void} This function does not return anything.
 */
function toggleCheckbox(i, taskIndex) {
    if (allTasks[taskIndex].subtasks[i].statusSubtask == "inProgress") {
        allTasks[taskIndex].subtasks[i].statusSubtask = "done";
        storeAllTasksBoard();
        displaySubstasks(allTasks[taskIndex]);
    } else {
        allTasks[taskIndex].subtasks[i].statusSubtask = "inProgress";
        storeAllTasksBoard();
        displaySubstasks(allTasks[taskIndex]);
    }
}

/**
 * Displays the assigned contacts for a given task.
 *
 * @param {Object} task - The task object containing the assigned contacts.
 * @return {undefined} This function does not return a value.
 */
function displayAssignedContacts(task) {
    let assignedContactContainer = document.getElementById("assigned-to-contacts");
    assignedContactContainer.innerHTML = "";
    if (task["assignedTo"]) {
      for (let i = 0; i < task["assignedTo"].length; i++) {
        const assignedContact = task["assignedTo"][i];
  
        assignedContactContainer.innerHTML += /*html*/ `
            <div class="assigned-to-contact">
                <p class="initials_circle" style="background-color: ${assignedContact.userColor}">${assignedContact.userInitials}</p>
                <p>${assignedContact.userName}</p>
            </div>
        `;
      }
    }
  }

/**
 * Deletes a task from the allTasks array at the specified index, shows a Toast-Message and closes the modal.
 *
 * @param {number} index - The index of the task to delete.
 * @return {Promise<void>} A promise that resolves when the task is successfully deleted.
 */
async function deleteTask(index) {
    allTasks.splice(index, 1);
    await storeAllTasksBoard();
    showSnackbarBoard('Task succesfully deleted');
    closeModalDetails();
    setTimeout(() => {
        redirectToBoard();
    }, 500);
}

/**
 * Closes the details modal by setting the width and left properties of the modal background element to 0 and 100% respectively.
 * Sets the overflow property of the body element to "auto".
 * Asynchronously calls the initBoard function to reinitialize the board.
 *
 * @return {Promise<void>} A promise that resolves when the modal details are closed and the board is reinitialized.
 */
async function closeModalDetails() {
    let modalBg = document.getElementById("modal-bg-details");
    modalBg.style.width = 0;
    modalBg.style.left = "100%";
    document.getElementById("body").style.overflow = "auto";
    document.getElementById('searchfield').value = "";
    await initBoard();
}

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", async function (event) {
    let modalBg = document.getElementById("modal-bg-details");
    if (event.target == modalBg) {
        modalBg.style.width = 0;
        modalBg.style.left = "100%";
        document.getElementById("body").style.overflow = "auto";
        document.getElementById('searchfield').value = "";
        initBoard();
    }
});