checkboxClicked = false;

/**
 * Initializes the login process by loading all users and resetting the login form.
 *
 * @return {Promise<void>} A promise that resolves when the login initialization is complete.
 */
async function initLogIn() {
  await loadAllUsers();
  resetLogInForm();
}

/**
 * Loads all users from the "remoteUsers" storage and parses the response.
 */
async function loadAllUsers() {
  users = await getItem("users");
}

/**
 * Asynchronously logs in the user by calling the `findUser` function.
 */
async function login() {
  findUser();
}

/**
 * Enables or disables the login button based on the values of the email and password fields.
 * If either field is empty, the button is disabled and its appearance is updated.
 * If both fields are filled, the button is enabled and its appearance is updated.
 *
 */
function disOrEnableLogInBtn() {
  if (document.getElementById("email").value == "" || document.getElementById("password").value == "") {
    if (document.getElementById("loginBtn").hasAttribute("disabled")) {
    } else {
      document.getElementById("loginBtn").setAttribute("disabled", "disabled");
      document.getElementById("loginBtn").classList.add("btn_dark_disabled");
      document.getElementById("loginBtn").classList.remove("btn_dark");
    }
  } else {
    document.getElementById("loginBtn").removeAttribute("disabled");
    document.getElementById("loginBtn").classList.remove("btn_dark_disabled");
    document.getElementById("loginBtn").classList.add("btn_dark");
  }
}

/**
 * Resets the login form by clearing all input fields.
 */
function resetLogInForm() {
  document.getElementById("logInForm").reset();
}

/**
 * Checks the state of the email and password fields in the login form and enables or disables the
 * "remember me" checkbox accordingly. If both fields are empty, the checkbox is disabled. If both
 * fields are filled, the checkbox is enabled and its appearance is updated. Additionally, if the
 * checkbox is enabled, the function saves the login information to local storage.
 *
 */
function checkBox() {
  let regex = /\/assets\/img\/icons\/checkbox_filled\.png/;
  let checkbox = document.getElementById("remember_me");
  if (document.getElementById("email").value == "" || document.getElementById("password").value == "") {
    document.getElementById("remember_me").setAttribute("disabled", true);

    setTimeout(() => {
      document.getElementById("remember_me").removeAttribute("disabled");
    }, 2000);
  } else {
    if (regex.test(checkbox.src)) {
      checkbox.src = "./assets/img/icons/checkbox_empty.png";
      checkboxClicked = false;
    } else {
      document.getElementById("remember_me").removeAttribute("disabled");
      checkbox.src = "./assets/img/icons/checkbox_filled.png";
      checkboxClicked = true;
    }
  }

}

/**
 * Saves the login information to the local storage.
 *
 * @param {string} email - The email entered by the user.
 * @param {string} password - The password entered by the user.
 */
function saveLogInLocalStorage() {
  let email = document.getElementById("email").value;
  // let password = document.getElementById("password").value;
  localStorage.setItem("userEmail", JSON.stringify(email));
  // localStorage.setItem("userPassword", JSON.stringify(password));
}

/**
 * Finds a user in the users array based on the email and password entered by the user.
 * If a user is found, it saves the user's initials and name in the local storage and redirects to the summary page.
 * If no user is found, it validates the password and performs other actions based on the validation result.
 *
 */
async function findUser() {
  let email = document.getElementById("email");
  if (users != null) {
    let user = users.find((u) => u.userEmail == email.value);
    if (user) {
      saveInitialsInLocalStorageLogIn(user);
      saveNameAInLocalStorageLogIn(user);
      validatePassword(user);
    } else {
      userNotValid();
    }
  } else {
    userNotValid();
  }
}

/**
 * Saves the user's initials to the local storage.
 *
 * @param {Object} user - The user object containing userInitials.
 */
function saveInitialsInLocalStorageLogIn(user) {
  let userInitials = user["userInitials"];
  localStorage.setItem("userInitials", JSON.stringify(userInitials));
}

function saveIndexInLocalStorage(user) {
  let userIndex = users.indexOf(user);
  localStorage.setItem("userIndex", JSON.stringify(userIndex));
}

/**
 * Saves the user's name in the local storage.
 *
 * @param {Object} user - The user object containing the user's name.
 */
function saveNameAInLocalStorageLogIn(user) {
  let userName = user["userName"];
  localStorage.setItem("userName", JSON.stringify(userName));
}

/**
 * Validates the password entered by the user.
 *
 * @return {boolean} Returns true if the password is valid, false otherwise.
 */
async function validatePassword(user) {
  let passwordError = document.getElementById("passwordError");
  let passwordInput = await encryptPassword(document.getElementById("password").value);
  
  if (user.userPassword == passwordInput) {
    passwordError.textContent = "";
    saveIndexInLocalStorage(user);
    redirectToSummary();
  } else {
    userNotValid();
  }
}

function userNotValid() {
  let passwordError = document.getElementById("passwordError");
  let passwordInput = document.getElementById("password")
  passwordError.style.display = "block";
  passwordError.style.color = "#ff7f8e";
  passwordError.textContent = "User doesn't exist or password is wrong.";
  passwordInput.value = "";
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
  const targetUrl = "../summary/summary.html";
  window.location.href = targetUrl;
}

/**
 * Redirects the user to the sign up page.
 *
 * @return {void} This function does not return a value.
 */
function redirectToSignUp() {
  const targetUrl = "../sign_up/sign_up.html";
  window.location.href = targetUrl;
}