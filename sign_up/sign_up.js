let users = [];
let colors = [
  "#FF7A00",
  "#FF5EB3",
  "#6E52FF",
  "#9327FF",
  "#00BEE8",
  "#1FD7C1",
  "#FF745E",
  "#FFA35E",
  "#FC71FF",
  "#FFC701",
  "#0038FF",
  "#C3FF2B",
  "#FFE62B",
  "#FF4646",
  "#FFBB2B",
];
let passwordInput = document.getElementById("password");
let passwordConfirmInput = document.getElementById("password_confirm");
let errorMessageContainer = document.getElementById("error-message-container");

/**
 * Initializes the user by resetting the sign-up form, loading all users, and logging the users array.
 */
async function initUser() {
  resetSignUpForm();
  await loadAllUsers();
}

/**
 * Loads all users from the remote server.
 */
async function loadAllUsers() {
  let remoteUsers = await getItem("users");

  if (remoteUsers != null) {
    users = await getItem("users");
  } else {
    users = [];
  }
}

async function encryptPassword(password) {
  const enc = new TextEncoder();
  const pw = enc.encode(password);
  const key = await crypto.subtle.digest('SHA-256', pw);
  const hashArray = Array.from(new Uint8Array(key)); // convert buffer to byte array
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
  return hashHex;
}

/**
 * Adds a user to the system.
 *
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 * @param {string} userPassword - The password of the user.
 */
async function addUser() {
  let userName = document.getElementById("username").value;
  let userEmail = document.getElementById("email").value;
  let userPassword = await encryptPassword(document.getElementById("password").value);
  console.log(userPassword);
  let userInitials = createInitials(userName);
  let userColor = createColors();

  let user = {
    userName: userName,
    userEmail: userEmail,
    userPassword: userPassword,
    userInitials: userInitials,
    userColor: userColor,
    contacts: [
      {
        "userColor": "#00D1B2",
        "userEmail": "timmy@testteam.de",
        "userInitials": "TT",
        "userName": "Timmy Test"
      },
      {
        "userColor": "#FF7A00",
        "userEmail": "d.grunow@hotmail.de",
        "userInitials": "DG",
        "userName": "Dominik Grunow"
      },
      {
        "userColor": userColor,
        "userEmail": userEmail,
        "userInitials": userInitials,
        "userName": userName
      }
    ],
    userTasks: [{
      "assignedTo": [
        {
          "userColor": "#00D1B2",
          "userEmail": "timmy@testteam.de",
          "userInitials": "TT",
          "userName": "Timmy Test"
        },
        {
          "userColor": "#FF7A00",
          "userEmail": "d.grunow@hotmail.de",
          "userInitials": "DG",
          "userName": "Dominik Grunow"
        },
        {
          "userColor": userColor,
          "userEmail": userEmail,
          "userInitials": userInitials,
          "userName": userName
        }
      ],
      "category": "User Story",
      "description": "Erstelle hier neue Tasks durch Klick auf 'Add Task' in der Sidebar oder auf das '+' über der jeweiligen Status-Spalte. Du kannst deine Tasks per Drag-and-Drop in ein anderes Statusfeld ziehen, deine Tasks bearbeiten oder löschen.",
      "dueDate": "2025-11-10",
      "priority": "low",
      "status": "todo",
      "title": "Willkommen"
    }]
  };
  let userExists = await userInDatabase(userEmail);

  if (validatePassword() && acceptPolicy() && userExists == false) {
    users.push(user);
    await storeAllUsers();
    signUpSuccessfullyInfo("You Signed Up successfully");
    saveNameInLocalStorage();
    redirectToLogin();
    errorMessageContainer.textContent = "";
  }
}

async function userInDatabase(email) {
  for (let index = 0; index < users.length; index++) {
    const user = users[index];

    if (email == user.userEmail) {
      showUserExistsError();
      return true;
    }
  }
  return false;
}

/**
 * Saves the value of the "username" input field in the local storage as "userName".
 */
function saveNameInLocalStorage() {
  let userName = document.getElementById("username").value;
  localStorage.setItem("userName", JSON.stringify(userName));
}

/**
 * Generates the initials of a given user name and saves them in the local storage.
 *
 * @param {string} userName - The name of the user.
 * @return {string} The first two initials of the user name.
 */
function createInitials(userName) {
  let userNameAsString = userName.toString();
  let initials = userNameAsString.match(/\b(\w)/g).join("");
  let firstTwoInitials = initials.slice(0, 2);
  saveInitialsInLocalStorage(firstTwoInitials);
  return firstTwoInitials;
}

/**
 * Saves the first two initials of a user in the local storage.
 *
 * @param {string} firstTwoInitials - The first two initials of the user.
 */
function saveInitialsInLocalStorage(firstTwoInitials) {
  localStorage.setItem("userInitials", JSON.stringify(firstTwoInitials));
}

/**
 * Enables or disables the sign up button based on the values of the username, email, password, and password confirmation fields.
 * If any of the fields are empty, the button is disabled and its appearance is updated.
 * If all fields are filled, the button is enabled and its appearance is updated.
 */
function disOrEnableSignUpBtn() {
  if (document.getElementById("username").value == "" || document.getElementById("email").value == "" || document.getElementById("password").value == "" || document.getElementById("password_confirm").value == "") {
    if (document.getElementById("registerBtn").hasAttribute("disabled")) {
    } else {
      document.getElementById("registerBtn").setAttribute("disabled", "disabled");
      document.getElementById("registerBtn").classList.add("btn_dark_disabled");
      document.getElementById("registerBtn").classList.remove("btn_dark");
    }
  } else {
    document.getElementById("registerBtn").removeAttribute("disabled");
    document.getElementById("registerBtn").classList.remove("btn_dark_disabled");
    document.getElementById("registerBtn").classList.add("btn_dark");
  }
}

/**
 * Validates the password entered by the user and performs corresponding actions based on the validation result.
 *
 * @param {Object} user - The user object containing user information.
 */
function validatePassword() {
  if (passwordInput.value !== passwordConfirmInput.value) {
    showPasswordError();
  } else {
    return true;
  }
}

function showPasswordError() {
  errorMessageContainer.style.display = "block";
  errorMessageContainer.style.color = "#ff7f8e";
  passwordConfirmInput.style.borderColor = "#ff7f8e";
  errorMessageContainer.textContent = "Passwords do not match";
  passwordInput.value = "";
  passwordConfirmInput.value = "";
}

/**
 * Asynchronously stores all users in the remoteUsers key of the remote storage.
 *
 */
async function storeAllUsers() {
  await setItem("users", users);
}

/**
 * Redirects the user to the login page after a delay of 3 seconds.
 *
 * @param {string} targetUrl - The URL of the login page.
 */
function redirectToLogin() {
  const targetUrl = "../index.html";
  setTimeout(() => {
    window.location.href = targetUrl;
  }, 3000);
}

/**
 * Asynchronously checks if the Privacy Policy has been accepted and performs the corresponding actions.
 *
 * @return {Promise<void>} A Promise that resolves when the Privacy Policy has been accepted and the user has been signed up successfully.
 */
function acceptPolicy() {
  if (document.getElementById("accept_policy").src.endsWith("/checkbox_filled.png")) {
    return true;
  } else {
    errorMessageContainer.style.display = "block";
    errorMessageContainer.style.color = "#ff7f8e";
    errorMessageContainer.textContent = "Please accept the Privacy Policy";
    return false;
  }
}

/**
 * Sets the source of the policy checkbox element to the path of the checked checkbox image.
 */
function checkBox() {
  let policyCheckbox = document.getElementById("accept_policy");
  if (policyCheckbox.src.endsWith("/checkbox_filled.png")) {
    policyCheckbox.src = "../assets/img/icons/checkbox_empty.png";
  } else {
    policyCheckbox.src = "../assets/img/icons/checkbox_filled.png";
  }
}

function showUserExistsError() {
  errorMessageContainer.style.display = "block";
  errorMessageContainer.style.color = "#ff7f8e";
  errorMessageContainer.textContent = "A user with this Email-Adress already exists";
}

/**
 * Resets the sign-up form.
 */
function resetSignUpForm() {
  document.getElementById("signUpForm").reset();
}

/**
 * Displays a success message in a snackbar for a specified duration.
 *
 * @param {string} message - The message to be displayed in the snackbar.
 */
function signUpSuccessfullyInfo(message) {
  let snackbarSignUp = document.getElementById("snackbarSignUp");
  snackbarSignUp.className = "show";
  snackbarSignUp.innerHTML = message;
  setTimeout(function () {
    snackbarSignUp.className = snackbarSignUp.className.replace("show", "");
  }, 2000);
}

/**
 * Generates a random color from the predefined colors array.
 *
 * @return {string} The randomly generated color.
 */
function createColors() {
  let color = colors[generateRandomNumber()];
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

function removeErrorMessage() {
  errorMessageContainer.style.removeProperty("display: block;");
  passwordConfirmInput.style.borderColor = "black";
  errorMessageContainer.textContent = "";
}