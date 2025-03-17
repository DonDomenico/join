/**
 * Displays a snackbar with the given message and hides it after 3 seconds.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 * @return {void} This function does not return anything.
 */
function showSnackbarAddTasks(message) {
  let snackbarAddTask = document.getElementById("snackbarAddTask");
  snackbarAddTask.className = "show";
  snackbarAddTask.innerHTML = message;
  setTimeout(function () {
    snackbarAddTask.className = snackbarAddTask.className.replace("show", "");
  }, 3000);
}

/**
 * Sets the priority of the task to "urgent" and updates the user interface accordingly.
 *
 * @return {undefined} This function does not return a value.
 */
function setPrioUrgent() {
  priority = "urgent";
  document.getElementById("urgentButton").classList.add("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_white.svg";
  removeMediumPrio();
  removeLowPrio();
}

/**
 * Sets the priority to "medium" and updates the corresponding button and image elements.
 *
 * @return {void} This function does not return a value.
 */
function setPrioMedium() {
  priority = "medium";
  document.getElementById("mediumButton").classList.add("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_white.svg";
  removeLowPrio();
  removeUrgentPrio();
}

/**
 * Sets the priority to low, adds a CSS class to the low button, changes the image source to a low priority icon, and removes any existing medium and urgent priorities.
 */
function setPrioLow() {
  priority = "low";
  document.getElementById("lowButton").classList.add("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_low_white.svg";
  removeMediumPrio();
  removeUrgentPrio();
}

/**
 * Removes the "urgent" priority styling by removing the CSS class from the urgent button and changing the image source to a red priority icon.
 *
 * @return {undefined} This function does not return a value.
 */
function removeUrgentPrio() {
  document.getElementById("urgentButton").classList.remove("urgent_button");
  document.getElementById("urgentImage").src = "../assets/img/icons/prio_urgent_red.svg";
}

/**
 * Removes the medium priority from the button and updates the corresponding image source.
 *
 * @return {undefined} This function does not return a value.
 */
function removeMediumPrio() {
  document.getElementById("mediumButton").classList.remove("medium_button");
  document.getElementById("mediumImage").src = "../assets/img/icons/prio_medium_orange.svg";
}

/**
 * Removes the low priority styling by removing the CSS class from the low button and changing the image source to a green low priority icon.
 *
 * @return {undefined} This function does not return a value.
 */
function removeLowPrio() {
  document.getElementById("lowButton").classList.remove("low_button");
  document.getElementById("lowImage").src = "../assets/img/icons/prio_kow_green.svg";
}

/**
 * Sets the border color of the "taskTitle" element to red and shows an error message if the title is empty.
 *
 * @return {undefined} This function does not return a value.
 */
function borderRedIfTitleEmpty() {
  if (document.getElementById("taskTitle").value == "") {
    document.getElementById("taskTitle").style.borderColor = "#ff8190";
    document.getElementById("errorContainerTitle").classList.remove("hide_error");
    document.getElementById("errorContainerTitle").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("taskTitle").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerTitle").classList.add("hide_error");
    document.getElementById("errorContainerTitle").classList.remove("error_container");
    disOrEnableButton();
  }
}

/**
 * Sets the border color of the "taskDueDate" element to red if it is empty and to grey otherwise.
 *
 * @return {void} This function does not return a value.
 */
function borderRedIfDateEmpty() {
  turnDateColorBlack();
  if (document.getElementById("taskDueDate").value == "") {
    document.getElementById("taskDueDate").style.borderColor = "#ff8190";
    document.getElementById("errorContainerDate").classList.remove("hide_error");
    document.getElementById("errorContainerDate").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("taskDueDate").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerDate").classList.add("hide_error");
    document.getElementById("errorContainerDate").classList.remove("error_container");
    disOrEnableButton();
  }
}

/**
 * Sets the border color of the "categoryButton" element to red if the button name is "Select task Category" and shows an error message,
 * otherwise sets the border color to grey.
 *
 * @return {void} This function does not return a value.
 */
function borderRedIfCategoryEmpty() {
  if (document.getElementById("buttonName").textContent == "Select task Category") {
    document.getElementById("categoryButton").style.borderColor = "#ff8190";
    document.getElementById("errorContainerCategory").classList.remove("hide_error");
    document.getElementById("errorContainerCategory").classList.add("error_container");
    disOrEnableButton();
  } else {
    document.getElementById("categoryButton").style.borderColor = "#a8a8a8";
    document.getElementById("errorContainerCategory").classList.add("hide_error");
    document.getElementById("errorContainerCategory").classList.remove("error_container");
    disOrEnableButton();
  }
}

/**
 * Adds the CSS class "subtask_container_blue_border" to the element with the id "subtaskContainer",
 * which changes the border color to blue.
 *
 * @return {void} This function does not return anything.
 */
function addBorderColorBlue() {
  document.getElementById("subtaskContainer").classList.add("subtask_container_blue_border");
}

/**
 * Removes the "subtask_container_blue_border" class from the element with the ID "subtaskContainer".
 *
 * @return {void} This function does not return a value.
 */
function removeBorderColorBlue() {
  document.getElementById("subtaskContainer").classList.remove("subtask_container_blue_border");
}

// window.addEventListener("click", function (e) {
//   if (document.getElementById("subtaskContainer").contains(e.target)) {
//     addBorderColorBlue();
//   } else {
//     removeBorderColorBlue();
//   }
// });
