/**
 * Opens the edit task modal and initializes the necessary data for editing a task.
 * 
 * @param {number} index - The index of the task to be edited.
 * @return {Promise<void>} A promise that resolves when the edit task modal is fully initialized.
 */
async function openEditTask(index) {
    clearArrays();
    closeModalDetails();
    document.getElementById("body").style.overflow = "hidden";
    let modalBg = document.getElementById("modal-bg");
    modalBg.style.width = "100%";
    modalBg.style.left = 0;
    document.getElementById("add-task-heading").style.display = "none";
    changeButtonsInTaskform(index);
    document.getElementById('taskTitle').onkeyup = "borderRedIfTitleEmptyEdit()";
    document.getElementById('categoryButton').setAttribute('disabled', 'true');
    document.getElementById('taskDueDate').onchange = "borderRedIfDateEmptyEdit()";
    await loadAllTasks();
    await loadContacts();
    await fillTaskFields(index);
}

/**
 * Fills the task fields with data from the allTasks array at the specified index.
 *
 * @param {number} index - The index of the task to fill the fields with.
 * @return {void} This function does not return anything.
 */
async function fillTaskFields(index) {
    document.getElementById("taskTitle").value = allTasks[index].title;
    document.getElementById("taskDescription").value = allTasks[index].description;
    document.getElementById("taskDueDate").value = allTasks[index].dueDate;
    document.getElementById("assignedToDropdown").innerHTML = "";
    document.getElementById("categoryDropdown").innerHTML = "";
    document.getElementById("buttonName").innerHTML = allTasks[index].category;
    setPrioButton(index);
    if (allTasks[index].assignedTo) {
      allTasks[index].assignedTo.forEach((contact) => assignedContacts.push(contact));
    }
    if (allTasks[index].subtasks) {
      allTasks[index].subtasks.forEach((subtask) => subtasks.push(subtask));
    }
    renderContactsToAssign();
    showAssignedtoContacts();
    renderCategories();
    renderSubtasks();
  }

/**
 * Updates the buttons in the task form based on the given index.
 *
 * @param {number} index - The index of the task.
 * @return {void} This function does not return anything.
 */
function changeButtonsInTaskform(index) {
    document.getElementById("buttons_container").innerHTML = /*html*/ `
          <button onclick="checkRequiredFieldsEdit(${index})" id="save_changes_button" type="button" class="btn_dark">Ok <img src="../assets/img/icons/white_check.svg" alt="" /></button>
      `;
}

/**
 * Saves the changes made to a task.
 *
 * @param {number} index - The index of the task in the allTasks array.
 * @return {Promise<void>} A promise that resolves when the changes are saved.
 */
async function saveTaskChanges(index) {
    showSnackbarBoard('Changes saved');
    allTasks[index].title = document.getElementById("taskTitle").value;
    allTasks[index].description = document.getElementById("taskDescription").value;
    allTasks[index].dueDate = document.getElementById("taskDueDate").value;
    allTasks[index].assignedTo = assignedContacts;
    allTasks[index].category = document.getElementById("buttonName").innerHTML;
    allTasks[index].subtasks = subtasks;
    allTasks[index].priority = priority;
    await storeAllTasksBoard();
    setTimeout(() => {
        closeModal();
    }, 1000);
    // redirectToBoard();
}

/**
 * Redoes the changes made to the task form, so the correct html is displayed when add-task is clicked.
 *
 * @return {Promise<void>} A promise that resolves when the changes are redone.
 */
async function redoChangesToTaskForm() {
    document.getElementById("add-task-heading").style.display = "block";
    document.getElementById('buttons_container').innerHTML = /*html*/ `
      <button id="clear-task-form-button" type="button" onmouseover="makeIconClearButtonBright()" onmouseleave="makeIconClearButtonDark()" onclick="clearForm()" class="btn_bright">Clear <img id="clearButtonImage" src="../assets/img/icons/black_x.svg" alt="" /></button>
      <button id="submit_task_button" type="submit" class="btn_dark_disabled">Create Task <img src="../assets/img/icons/white_check.svg" alt="" /></button>
    `;
    document.getElementById('taskTitle').onkeyup = "borderRedIfTitleEmpty()";
    document.getElementById('categoryButton').removeAttribute('disabled');
}

/**
 * Checks if the required fields in the edit task form are filled. If any of the fields are empty, it calls the function to highlight the field in red. 
 * If all the fields are filled, it enables the save changes button, calls the function to save the changes, and then disables the save changes button again.
 *
 * @param {number} index - The index of the task in the allTasks array.
 * @return {void} This function does not return anything.
 */
function checkRequiredFieldsEdit(index) {
    if (document.getElementById("taskTitle").value == "" || document.getElementById("taskDueDate").value == "" || document.getElementById("buttonName").textContent == "Select task Category") {
        borderRedIfTitleEmptyEdit();
    } else {
        document.getElementById("save_changes_button").classList.remove("btn_dark_disabled");
        document.getElementById("save_changes_button").classList.add("btn_dark");
        saveTaskChanges(index);
        document.getElementById("save_changes_button").classList.add("btn_dark_disabled");
        document.getElementById("save_changes_button").classList.remove("btn_dark");
    }
}

/**
 * Sets the border color of the task title input to red and displays an error message if the input is empty.
 * Otherwise, sets the border color to gray and hides the error message.
 *
 * @return {void} This function does not return anything.
 */
function borderRedIfTitleEmptyEdit() {
    if (document.getElementById("taskTitle").value == "") {
        document.getElementById("taskTitle").style.borderColor = "#ff8190";
        document.getElementById("errorContainerTitle").classList.remove("hide_error");
        document.getElementById("errorContainerTitle").classList.add("error_container");
    } else {
        document.getElementById("taskTitle").style.borderColor = "#a8a8a8";
        document.getElementById("errorContainerTitle").classList.add("hide_error");
        document.getElementById("errorContainerTitle").classList.remove("error_container");
    }
}

/**
 * Sets the border color of the "taskDueDate" input field to "#ff8190" and adds the "error_container" class to the "errorContainerDate" element if the input field is empty.
 * Sets the border color of the "taskDueDate" input field to "#a8a8a8" and adds the "hide_error" class to the "errorContainerDate" element if the input field is not empty.
 *
 * @return {void} This function does not return anything.
 */
function borderRedIfDateEmptyEdit() {
    if (document.getElementById("taskDueDate").value == "") {
        document.getElementById("taskDueDate").style.borderColor = "#ff8190";
        document.getElementById("errorContainerDate").classList.remove("hide_error");
        document.getElementById("errorContainerDate").classList.add("error_container");
    } else {
        document.getElementById("taskDueDate").style.borderColor = "#a8a8a8";
        document.getElementById("errorContainerDate").classList.add("hide_error");
        document.getElementById("errorContainerDate").classList.remove("error_container");
    }
}

/**
 * Sets the border color of the "categoryButton" input field to "#ff8190" and adds the "error_container" class to the "errorContainerCategory" element if the selected category is empty.
 * Sets the border color of the "categoryButton" input field to "#a8a8a8" and adds the "hide_error" class to the "errorContainerCategory" element if the selected category is not empty.
 *
 * @return {void} This function does not return anything.
 */
function borderRedIfCategoryEmptyEdit() {
    if (document.getElementById("buttonName").textContent == "Select task Category") {
        document.getElementById("categoryButton").style.borderColor = "#ff8190";
        document.getElementById("errorContainerCategory").classList.remove("hide_error");
        document.getElementById("errorContainerCategory").classList.add("error_container");
    } else {
        document.getElementById("categoryButton").style.borderColor = "#a8a8a8";
        document.getElementById("errorContainerCategory").classList.add("hide_error");
        document.getElementById("errorContainerCategory").classList.remove("error_container");
    }
}

/**
 * Sets the priority button based on the priority of a task.
 *
 * @param {number} index - The index of the task in the allTasks array.
 * @return {undefined} This function does not return a value.
 */
function setPrioButton(index) {
    if (allTasks[index].priority == "urgent") {
        setPrioUrgent();
    } else if (allTasks[index].priority == "medium") {
        setPrioMedium();
    } else {
        setPrioLow();
    }
}