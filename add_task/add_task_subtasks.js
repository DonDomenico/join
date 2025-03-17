/**
 * Shows or hides the icons subtasks container based on the value of the task subtask input field.
 *
 * @return {void} This function does not return anything.
 */
function showIconsSubtasks() {
  if (document.getElementById("taskSubtask").value !== "") {
    document.getElementById("iconsSubtasksContainer").classList.remove("d_none");
  } else {
    document.getElementById("iconsSubtasksContainer").classList.add("d_none");
  }
}

/**
 * Clears the subtask by resetting the taskSubtask value, hiding icons, and stopping event propagation.
 *
 * @return {void} This function does not return anything.
 */
function clearSubtask() {
  document.getElementById("taskSubtask").value = "";
  document.getElementById("iconsSubtasksContainer").classList.add("d_none");
  removeBorderColorBlue();
  event.stopPropagation();
}

/**
 * Adds a subtask to the list of subtasks.
 *
 * @param {string} taskSubtask - The value of the task subtask input field.
 * @return {void} This function does not return anything.
 */
function addSubtask() {
  if (document.getElementById("taskSubtask").value) {
    let nameSubtask = document.getElementById("taskSubtask").value;
    let statusSubtask = "inProgress";
    let subtask = {
      nameSubtask: nameSubtask,
      statusSubtask: statusSubtask,
    };
    subtasks.push(subtask);
    renewSubtasks();
  }
  removeBorderColorBlue();
  event.stopPropagation();
}

/**
 * Renews the subtasks by clearing the existing subtasks and rendering them again.
 *
 * @return {void} This function does not return anything.
 */
function renewSubtasks() {
  clearSubtask();
  renderSubtasks();
}

/**
 * Renders the subtasks in the "subtasksRenderContainer" element.
 *
 * @return {void} This function does not return anything.
 */
function renderSubtasks() {
  document.getElementById("subtasksRenderContainer").innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    let subtaskName = subtasks[i].nameSubtask;
    document.getElementById("subtasksRenderContainer").innerHTML += generateSubtasks(i, subtaskName);
  }
}

/**
 * Generates the HTML code for a subtask element.
 *
 * @param {number} i - The index of the subtask.
 * @param {string} subtaskName - The name of the subtask.
 * @return {string} The generated HTML code for the subtask element.
 */
function generateSubtasks(i, subtaskName) {
  return `<div id="renderedSubtask${i}" onclick="makeRenderedSubtasksEditable(${i})" onmouseover="showPenAndTrash(${i})" onmouseout="hidePenAndTrash(${i})" class="rendered_subtask" contenteditable="true">
    <div class="span_container ">
      <span class="rendered_subtasks_span">&#x2022</span>
      <span id="subtasName${i}"> ${subtaskName}</span>
    </div>
    <div id="containerPenAndTrash${i}" class="d_none">
      <img onclick="makeRenderedSubtasksEditable(${i})" id="pen${i}" src="../assets/img/icons/subtasks_pen.png" alt="">
      <img src="../assets/img/icons/subtask_line.png" alt="">
      <img onclick="deleteSubtask(${i})" id="trash${i}" src="../assets/img/icons/subtask_trash.png" alt="">
    </div>
    <div id="containerTrashAndCheck${i}" class="d_none">
      <img onclick="deleteRenderedSubtask(${i})" src="../assets/img/icons/subtask_trash.png" alt="">
      <img src="../assets/img/icons/subtask_line.png" alt="">
      <img onclick="overwriteSubtask(${i})" src="../assets/img/icons/subtask_check.png" alt="">
    </div>
  </div>`;
}

/**
 * Shows the pen and trash container for a specific subtask.
 *
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return anything.
 */
function showPenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.remove("d_none");
}

/**
 * Hides the pen and trash container for a specific subtask.
 *
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return anything.
 */
function hidePenAndTrash(i) {
  document.getElementById(`containerPenAndTrash${i}`).classList.add("d_none");
}

/**
 * Deletes a subtask from the subtasks array at the specified index and re-renders the subtasks.
 *
 * @param {number} i - The index of the subtask to be deleted.
 * @return {void} This function does not return anything.
 */
function deleteSubtask(i) {
  subtasks.splice(i, 1);
  renderSubtasks();
  event.stopPropagation();
}

/**
 * Makes the rendered subtask at the specified index editable by setting its "contenteditable" attribute to true.
 * Also, sets an empty onmouseover event handler for the rendered subtask.
 * Hides the pen and trash containers for the subtask.
 * Shows the trash and check containers for the subtask.
 *
 * @param {number} i - The index of the rendered subtask to make editable.
 * @return {void} This function does not return anything.
 */
function makeRenderedSubtasksEditable(i) {
  document.getElementById(`renderedSubtask${i}`).setAttribute("contenteditable", true);
  document.getElementById(`renderedSubtask${i}`).onmouseover = function () {};
  hidePenAndTrash(i);
  showTrashAndCheck(i);
}

/**
 * Displays the trash and check containers for the specified subtask.
 *
 * @param {number} i - The index of the subtask.
 * @return {void} This function does not return anything.
 */
function showTrashAndCheck(i) {
  document.getElementById(`containerTrashAndCheck${i}`).classList.remove("d_none");
}

/**
 * Deletes a rendered subtask and stops the event propagation.
 *
 * @param {number} i - The index of the subtask to be deleted.
 * @return {void} This function does not return anything.
 */
function deleteRenderedSubtask(i) {
  deleteSubtask(i);
  event.stopPropagation();
}

/**
 * Updates the name of a subtask at the specified index and re-renders the subtasks.
 *
 * @param {number} i - The index of the subtask to be updated.
 * @return {void} This function does not return anything.
 */
function overwriteSubtask(i) {
  let newValueSubtaskName = document.getElementById(`subtasName${i}`).innerText;
  subtasks[i].nameSubtask = newValueSubtaskName;
  renderSubtasks();
  document.getElementById(`containerTrashAndCheck${i}`).classList.add("d_none");
  event.stopPropagation();
  document.getElementById(`containerPenAndTrash${i}`).classList.add("d_none");
  event.stopPropagation();
}
