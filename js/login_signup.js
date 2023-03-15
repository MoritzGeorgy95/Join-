/**
 * This file handles the logic needed to sign up for a new account and
 * validates user input when trying to login.
 */

//script variables
let cardContainer = document.getElementById("card-container");
let header = document.getElementsByTagName("header")[0];
let signupSuccess = false;
setURL(
  "https://moritz-georgy.developerakademie.net/Modul10/smallest_backend_ever"
);

/**
 * Main functions
 */
async function init() {
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  users.forEach((u) => {
    if (u.loggedIn == true) {
      u.loggedIn = false;
    }
  });
  await backend.setItem("users", JSON.stringify(users));
  setTimeout(function () {
    renderLogin();
  }, 800);
}

/**
 * rendering
 */

function renderSignUpWrapper() {
  let signUpWrapper = document.createElement("div");
  signUpWrapper.classList.add("signup-wrapper");
  signUpWrapper.innerHTML = headerTemplate();
  header.append(signUpWrapper);
}

function renderLogin() {
  cardContainer.innerHTML = loginCardTemplate();
  if (localStorage.length > 0) {
    let password = document.getElementById("login-password");
    let email = document.getElementById("login-mail");
    password.value = localStorage.getItem("password");
    email.value = localStorage.getItem("email");
  }
  addLoginEventListeners();
  if (signupSuccess) {
    let success = document.getElementById("success");
    success.innerText = "Signup successful!";
  }
  renderSignUpWrapper();
}

function renderSignUp() {
  signupSuccess = false;
  let signUpWrapper = document.getElementsByClassName("signup-wrapper")[0];
  signUpWrapper.remove();
  cardContainer.innerHTML = signUpCardTemplate();
  addSignupEventListeners();
}

function renderLoginDeny() {
  document.getElementById("invalid").innerText = "Invalid Username or Password";
}

function renderNoUser() {
  document.getElementById("noUser").innerText =
    "E-Mail does not exist in database.";
}

function generateTooltip(e) {
  let message = "This field is required!";
  let inputField = e.target;
  let pattern = /^[0-9]*[a-zA-Z]{2,}.*$/;
  if (inputField.type === "email" && inputField.value.length > 0) {
    message = "Please enter a valid email adress!";
  }

  if (
    inputField.type === "text" &&
    inputField.value.length > 0 &&
    !pattern.test(inputField.value)
  ) {
    message = "Username must contain at least 2 letters!";
  }

  let tooltip = document.createElement("div");
  tooltip.classList.add("validation-tooltip");
  tooltip.innerHTML = /*html*/ `
        <p>!</p>
        <p>${message}</p>
        `;
  e.target.parentNode.append(tooltip);
}

function renderForgotPassword() {
  cardContainer.innerHTML = forgotPasswordTemplate();
  let signUpWrapper = document.getElementsByClassName("signup-wrapper")[0];
  signUpWrapper.remove();
  addForgotPasswordEventListener();
}

/**
 * adding event listeners
 */

function addLoginEventListeners() {
  let loginForm = document.querySelector("#login-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });
  let guestLoginButton = document.querySelector("#guestLogin");
  guestLoginButton.addEventListener("click", function (event) {
    event.preventDefault();
    guestLogin();
  });
}

function addSignupEventListeners() {
  let signupForm = document.querySelector("#signup-form");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    signUp();
  });
}

function addForgotPasswordEventListener() {
  let forgotPasswordForm = document.getElementById("forgot-password-form");
  forgotPasswordForm.addEventListener("submit", function (event) {
    event.preventDefault();
    sendPasswordReset();
  });
}

window.addEventListener("click", function () {
  removeLoginDeny();
  removeSignUpSuccess();
  removeValidationTooltip();
  removeNoUser();
});

/**
 * sign up/ log in/ password reset
 */

async function signUp() {
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  let name = document.getElementById("signup-name");
  let email = document.getElementById("signup-mail");
  let password = document.getElementById("signup-password");
  let newUser = {
    name: name.value,
    email: email.value,
    password: password.value,
    loggedIn: false,
  };
  users.push(newUser);
  await backend.setItem("users", JSON.stringify(users));
  signupSuccess = true;
  renderLogin();
}

async function login() {
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  let password = document.getElementById("login-password");
  let email = document.getElementById("login-mail");
  let index = users.findIndex((u) => {
    return u.password == password.value && u.email == email.value;
  });
  if (index !== -1) {
    let checkbox = document.getElementById("checkbox");
    if (checkbox.checked) {
      localStorage.setItem("password", password.value);
      localStorage.setItem("email", email.value);
    }
    users[index].loggedIn = true;
    await backend.setItem("users", JSON.stringify(users));
    window.location.href = "summary.html";
  } else {
    renderLoginDeny();
  }
}

function guestLogin() {
  let password = document.getElementById("login-password");
  let email = document.getElementById("login-mail");
  password.value = "guest";
  email.value = "guest@mail.de";
  setTimeout(function () {
    window.location.href = "summary.html";
  }, 250);
}

async function sendPasswordReset() {
  let passwordResetMail = document.querySelector("#password-reset-mail");
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  let user = users.find((u) => {
    return u.email == passwordResetMail.value;
  });
  if (user) {
    alert("Password reset E-Mail sent!");
    renderLogin();
  } else {
    renderNoUser();
  }
}

/**
 * removing temporary elements from document
 */

function removeNoUser() {
  let noUser = document.getElementById("noUser");
  if (noUser) {
    noUser.innerText = "";
  }
}

function removeLoginDeny() {
  let errorMessage = document.getElementById("invalid");
  if (errorMessage) {
    errorMessage.innerText = "";
  }
}

function removeSignUpSuccess() {
  let successMessage = document.getElementById("success");
  if (successMessage) {
    successMessage.innerText = "";
  }
}

function removeValidationTooltip() {
  let tooltips = document.getElementsByClassName("validation-tooltip");
  if (tooltips) {
    [...tooltips].forEach((element) => {
      element.remove();
    });
  }
}

//template functions

function headerTemplate() {
  return /*html*/ `
        <p>Not a join user?</p>
        <button onclick="renderSignUp()">Sign up</button>
  `;
}

function loginCardTemplate() {
  return /*html*/ `
        
  
        <form class='form-card' id="login-form">
          <h1>Log in</h1>
          <img src="assets/img/icon_line.png" class="line">
          <div class='user-input'>
            <input id='login-mail' type='email' placeholder='Email' required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_mail.png' />
          </div>
          <div class='user-input'>
            <p id="invalid"></p>
            <p id="success"></p>
            <input id='login-password' type='password' placeholder='Password' required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_lock.png' />
          </div>
          
          <div class='login-options-container'>
            <div class='column1'>
              <div>
                <input type='checkbox' id="checkbox"/>
                <p>Remember me</p>
              </div>
              <p class="forgot" onclick="renderForgotPassword()">Forgot my password</p>
            </div>
            <div class='column2'>
              
              <button>Log in</button>
              <button id="guestLogin">Guest Log in</button>
            </div>
          </div>
        </form>
    `;
}

function signUpCardTemplate() {
  return /*html*/ `
     <form class='form-card' id="signup-form">
      <img src='assets/img/icon_back.png' alt='arrow' class='go-back' onclick='renderLogin()'>
          <h1>Sign Up</h1>
          <img src="assets/img/icon_line.png" class="line">
          <div class='user-input'>
            <input id='signup-name' type='text' placeholder='Name' pattern="^[0-9]*[a-zA-Z]{2,}.*$" required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_name.png' />
          </div>
          <div class='user-input' id="responsive-exception" >
            <input id='signup-mail' type='email' placeholder='Email' required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_mail.png' />
          </div>
          <div class='user-input'>
            <input id='signup-password' type='password' placeholder='Password' required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_lock.png' />
          </div>
          <button class='sign-up'>Sign up</button>
      </form>
  `;
}

function forgotPasswordTemplate() {
  return /*html*/ `
    <form class='form-card' id="forgot-password-form">
      <img src='assets/img/icon_back.png' alt='arrow' class='go-back' onclick='renderLogin()'>
          <h1>Reset password</h1>
          <img src="assets/img/icon_line.png" class="line">
          <h4>In order to reset your password enter account E-Mail below in order to receive instructions on how to change your password.</h4>
          <div class='user-input'>
            <input id='password-reset-mail' type='email' placeholder='Email' required oninvalid="event.preventDefault(); generateTooltip(event)"/>
            <img src='assets/img/icon_mail.png' />
            <p id="noUser"></p>
          </div>
          <button class='sign-up'>Send Email</button>
      </form>
  `;
}
