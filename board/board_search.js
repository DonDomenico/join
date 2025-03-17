/**
 * Renders all todos or matching todos based on the input value.
 *
 * @return {void} This function does not return a value.
 */
function renderAllOrMatchingTodos() {
  findMatchingTitles();
  document.getElementById("errorContainer").innerHTML = "";
  if (saveInputValue() == "") {
    updateHTML(allTasks); // Todo
  } else {
    renderErrorOrMatchingDodos();
  }
}

/**
 * Asynchronously finds and pushes matching todos based on the input value.
 *
 * @return {Promise<void>} A promise that resolves when the matching todos are pushed.
 */
async function findMatchingTitles() {
  await pushMatchingTodos(saveInputValue());
}

/**
 * Saves the input value from the "searchfield" element and returns it in lowercase.
 *
 * @return {string} The lowercase input value from the "searchfield" element.
 */
function saveInputValue() {
  let search = document.getElementById("searchfield").value;
  return search.toLowerCase();
}

/**
 * Asynchronously finds and pushes matching todos based on the input value.
 *
 * @param {string} search - The search term to match against task titles and descriptions.
 * @return {Promise<void>} A promise that resolves when the matching todos are pushed.
 */
async function pushMatchingTodos(search) {
  matchingTodos = [];
  for (let index = 0; index < allTasks.length; index++) {
    let title = allTasks[index].title;
    let description = allTasks[index].description;
    if (title.toLowerCase().includes(search) || description.toLowerCase().includes(search)) {
      matchingTodos.push(allTasks[index]);
    }
  }
}

/**
 * Renders an error message if there are no matching todos, otherwise updates the HTML with the matching todos.
 *
 * @return {void} This function does not return a value.
 */
function renderErrorOrMatchingDodos() {
  if (matchingTodos.length == 0) {
    renderErrorBoard();
    updateHTML(matchingTodos);
  } else {
    updateHTML(matchingTodos); // ToDo
  }
}

function renderErrorBoard() {
  let errorContent = document.getElementById("errorContainer");
  errorContent.innerHTML += `
  Keine Ergebnisse gefunden.
  `;
}