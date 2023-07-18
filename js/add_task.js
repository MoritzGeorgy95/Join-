/**
 * This file handles all the logic that is needed to process all user inputs/ all user interaction
 * when wanting to create a new task.
 * This file is mostly equivalent to board-js/add_task.js but contains minor adjustments to the application context.
 * Check board-js/add_task.js for more detailed commenting.
 */

/* script variables */

/**
 * Sets the URL for backend communication.
 * @param {string} url - The URL for backend communication.
 */
setURL(
  "https://moritz-georgy.developerakademie.net/Modul10/smallest_backend_ever"
);

let tasks = [];
let team = [];

/**
 * Loads data from the server and initializes the tasks and team arrays.
 * @returns {Promise<void>}
 */
async function preloader() {
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("keyTasks")) || [];
  team = JSON.parse(backend.getItem("contacts")) || [];
}

let form = document.getElementsByTagName("form")[0];
let title = document.getElementById("title");
let description = document.getElementById("description");
let date = document.getElementById("date");
//subtask elements
let subtaskInputField = document.getElementById("addSubtask");
let subtaskOnInput = document.getElementById("subtaskOninput");
let addSubtaskIcon = document.getElementById("addSubtaskIcon");
let clearSubtaskInput = document.getElementById("clearSubtaskInput");
let finishEditingSubtask = document.getElementById("finishEditingSubtask");
let subtaskContainer = document.getElementById("subtaskContainer");

//clear & create task button
let clear = document.getElementById("clear");
let create = document.getElementById("create");

/**
 * Event listener for the clear button. Reloads the page.
 * @param {Event} e - The event object.
 */
clear.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.reload();
});

//category elements
let clearCategory = document.getElementById("clearCategory");
let addCategory = document.getElementById("addCategory");
let dropdownOpen = false;
let editingCategory = false;
let categories = ["New Category", "Sales", "Marketing"];
let colorDots = document.getElementsByClassName("color-dot");
let assignedColors = [null, colorDots[1], colorDots[2]];
let categoryInput = document.getElementById("selectCategory");
let dropdownContainer = document.getElementById("dropdownContainer");
let categoryOninput = document.getElementById("categoryOninput");
let colorContainer = document.getElementById("colorContainer");
let categoryDot = document.getElementById("categoryDot");

/**
 * Event listener for the category input field. Toggles the visibility of the category dropdown container.
 */
categoryInput.addEventListener("click", function () {
  if (!editingCategory) {
    if (dropdownOpen) {
      dropdownContainer.style.display = "none";
      categoryInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
      categoryInput.style.borderRadius = "7px";
      dropdownOpen = false;
    } else {
      categoryInput.style.borderBottom = "none";
      categoryInput.style.borderRadius = "7px 7px 0 0";
      dropdownContainer.style.display = "block";
      dropdownContainer.innerHTML = "";
      dropdownContainer.innerHTML += `<div class="category" id="newCategory">${categories[0]}</div>`;
      if (categories.length > 1) {
        for (let i = 1; i < categories.length; i++) {
          let color = assignedColors[i];
          if (color != null) {
            color.classList.remove("selected");
            dropdownContainer.innerHTML += `<div class="category" onclick="selectCategory(event)"><div class="category-text">${categories[i]}</div> ${color.outerHTML}</div>`;
          } else {
            dropdownContainer.innerHTML += `<div class="category" onclick="selectCategory(event)"><div class="category-text">${categories[i]}</div></div>`;
          }
        }
      }

      addListenerToNewCategory();
      dropdownOpen = true;
    }
  }
});

/**
 * Event listener for the new category div. Displays the category input field for creating a new category.
 */
function addListenerToNewCategory() {
  let newCategory = document.getElementById("newCategory");
  newCategory.addEventListener("click", function () {
    categoryOninput.style.display = "flex";
    dropdownContainer.style.display = "none";
    categoryInput.value = "";
    categoryInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
    categoryInput.style.borderRadius = "7px";
    categoryDot.style.display = "none";
    categoryInput.placeholder = "New category name";
    categoryInput.removeAttribute("readonly");
    colorContainer.style.display = "flex";
    editingCategory = true;
  });
}

/**
 * Event listener for the clear category button. Resets the category input field and color container.
 */
clearCategory.addEventListener("click", function () {
  categoryInput.value = "Select Task Category";
  colorContainer.style.display = "none";
  categoryInput.setAttribute("readonly", "true");
  dropdownOpen = false;
  editingCategory = false;
  categoryOninput.style.display = "none";
  for (let i = 0; i < colorDots.length; i++) {
    const dot = colorDots[i];
    if (dot.classList.contains("selected")) {
      dot.classList.remove("selected");
    }
  }
});

/**
 * Event listener for the add category button. Adds a new category to the categories array.
 */
addCategory.addEventListener("click", function () {
  if (categoryInput.value.length > 0) {
    colorContainer.style.display = "none";
    categoryInput.setAttribute("readonly", "true");
    dropdownOpen = false;
    editingCategory = false;
    categoryOninput.style.display = "none";
    [...colorDots].forEach((el) => {
      if (el.classList.contains("selected")) {
        assignedColors.push(el);
      }
    });
    let filteredArray = Array.prototype.filter.call([...colorDots], condition);
    let noMatch = filteredArray.length === 0;
    if (noMatch) {
      categories.push(categoryInput.value);
      assignedColors.push(null);
    } else {
      categories.push(categoryInput.value);
      displayColorDot();
    }
  }
});

/**
 * Condition function for filtering color dots based on their selected state.
 * @param {Element} el - The color dot element.
 * @returns {boolean} - The result of the condition.
 */
let condition = function (el) {
  return el.classList.contains("selected");
};

//add listeners to every color dot
for (let i = 0; i < colorDots.length; i++) {
  const dot = colorDots[i];
  dot.addEventListener("click", function (e) {
    scaleUp(e);
  });
}

/**
 * Event listener for the color dots. Scales up the clicked color dot and updates the selected color.
 * @param {Event} e - The event object.
 */
function scaleUp(e) {
  for (let i = 0; i < colorDots.length; i++) {
    const dot = colorDots[i];
    if (dot.classList.contains("selected")) {
      dot.classList.remove("selected");
    }
  }
  e.target.classList.add("selected");
}

/**
 * Display color dot and let user select categories
 * @param {Event} e - The event object
 */
function selectCategory(e) {
  let category = e.target;
  let categoryText = category.getElementsByClassName("category-text")[0];
  categoryInput.value = categoryText.innerText;
  let textDot = category.getElementsByClassName("color-dot")[0];
  let classes = textDot.classList;
  let color = classes[1];
  categoryDot.className = "";
  categoryDot.style.display = "inline";
  categoryDot.classList.add(color);
  categoryDot.style.right = `24px`;
}

/**
 * Display color dot when a color is selected
 */
function displayColorDot() {
  let colorDiv = assignedColors[assignedColors.length - 1];
  selectedColor = colorDiv.classList[1];
  categoryDot.className = "";
  categoryDot.classList.add(selectedColor);
  categoryDot.style.right = `24px`;
  categoryDot.style.display = "inline";
}

// Assigned contacts
let contactsOpened = false;

let assignedToInput = document.getElementById("assignedTo");
let contactsDropdown = document.getElementById("contactsDropdownContainer");
let contactsDropdownOpen = false;

assignedToInput.addEventListener("click", function () {
  if (contactsDropdownOpen) {
    contactsDropdownOpen = false;
    contactsDropdown.style.display = "none";
    assignedToInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
    assignedToInput.style.borderRadius = "7px";
    showAssignedContacts();
  } else if (!contactsDropdownOpen && !contactsOpened) {
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdown.innerHTML = "";
    for (let i = 0; i < team.length; i++) {
      const contact = team[i];
      contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_name.png"> ${contact.userName}</div> <input type="checkbox" class="checkbox-primary"></div>`;
    }
    contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_mail.png"> Invite new contact</div></div>`;
    contactsDropdownOpen = true;
    contactsOpened = true;
    hideAssignedContacts();
  } else {
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdownOpen = true;
    hideAssignedContacts();
  }
});

/**
 * Show assigned contacts as chosen contacts
 */
function showAssignedContacts() {
  let checkboxes = document.querySelectorAll(".checkbox-primary");

  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    if (checkbox.checked) {
      let name = team[i].userName;
      let initials = name
        .split(" ")
        .map((l) => l.charAt(0))
        .join("");
      document.getElementById("avatarContainer").innerHTML += /*html*/ `
        <div class="chosenContact" style="background: ${team[i].color}">${initials}</div>
      `;
    }
  }
}

/**
 * Hide assigned contacts
 */
function hideAssignedContacts() {
  document.getElementById("avatarContainer").innerHTML = "";
}

// Add event listeners to priority items
let prioContainer = document.getElementById("prio");
let prioBtns = document.getElementsByClassName("prio-btn");
prioContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("prio-btn")) {
    if (!e.target.classList.contains("active")) {
      let active = document.querySelectorAll(".active");
      for (let i = 0; i < active.length; i++) {
        if (active[i] !== e.target) {
          active[i].classList.remove("active");
        }
      }
      e.target.classList.add("active");
      if (e.target === prioBtns[0]) {
        applyStylesButton(0);
      } else if (e.target === prioBtns[1]) {
        applyStylesButton(1);
      } else {
        applyStylesButton(2);
      }
    }
  }
});

/**
 * Apply styles to priority buttons
 * @param {number} buttonIndex - The index of the selected button
 */
function applyStylesButton(buttonIndex) {
  const colors = [
    { bgColor: "rgb(255, 61, 0)", textColor: "white" },
    { bgColor: "rgb(255, 168, 0)", textColor: "white" },
    { bgColor: "rgb(122, 226, 41)", textColor: "white" },
  ];

  for (let i = 0; i < prioBtns.length; i++) {
    if (i === buttonIndex) {
      prioBtns[i].style.backgroundColor = colors[i].bgColor;
      prioBtns[i].style.color = colors[i].textColor;
    } else {
      prioBtns[i].style.backgroundColor = "white";
      prioBtns[i].style.color = "black";
    }
  }
}

// Subtask functionality

// Subtask input field listener
subtaskInputField.addEventListener("click", function () {
  subtaskOnInput.style.display = "flex";
  addSubtaskIcon.style.display = "none";
});

clearSubtaskInput.addEventListener("click", function () {
  subtaskInputField.value = "";
  subtaskOnInput.style.display = "none";
  addSubtaskIcon.style.display = "inline";
});

finishEditingSubtask.addEventListener("click", function () {
  let createdSubtasks = document.querySelectorAll(".subtask-counter");
  if (subtaskInputField.value.length > 0 && createdSubtasks.length < 3) {
    subtaskContainer.innerHTML += /*html*/ `
             <div class="subtask">
                <p class="subtask-counter">&#9675; ${subtaskInputField.value}</p>
                 <img src="assets/img/icon_trash.png" class="subtask-image" onclick="removeParent(event)">
             </div>
     `;
    subtaskInputField.value = "";
  } else if (createdSubtasks.length >= 3) {
    alert("You exceeded the subtask limit of three.");
  }
});

/**
 * Remove the parent element of the clicked element
 * @param {Event} e - The event object
 */
function removeParent(e) {
  e.target.parentNode.remove();
}

// Add listener to create task button
form.addEventListener("submit", function (event) {
  event.preventDefault();
  formValidation();
});

// Modify calendar so you can only select current date or date in the future
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;
document.getElementById("date").min = today;
