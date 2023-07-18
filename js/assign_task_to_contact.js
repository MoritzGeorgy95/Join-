/* script variables */

let form = document.getElementsByClassName("form")[0];
let title = document.getElementById("title");
let description = document.getElementById("description");
let date = document.getElementById("date");

let contactsOpened = false;

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

//add listener to category input field
categoryInput.addEventListener("click", function () {
  if (!editingCategory) {
    if (dropdownOpen) {
      dropdownContainer.style.display = "none";
      categoryInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
      categoryInput.style.borderRadius = "7px";
      dropdownOpen = false;
    } else if (!dropdownOpen) {
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

//add listener to new category div
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

function scaleUp(e) {
  for (let i = 0; i < colorDots.length; i++) {
    const dot = colorDots[i];
    if (dot.classList.contains("selected")) {
      dot.classList.remove("selected");
    }
  }
  e.target.classList.add("selected");
}

//display color dot and let user select categories
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

function displayColorDot() {
  let colorDiv = assignedColors[assignedColors.length - 1];
  selectedColor = colorDiv.classList[1];
  categoryDot.className = "";
  categoryDot.classList.add(selectedColor);
  categoryDot.style.right = `24px`;
  categoryDot.style.display = "inline";
}

//assigned contacts

let assignedToInput = document.getElementById("assignedTo");
let contactsDropdown = document.getElementById("contactsDropdownContainer");
let contactsDropdownOpen = false;

assignedToInput.addEventListener("click", function () {
  if (contactsDropdownOpen) {
    contactsDropdownOpen = false;
    contactsDropdown.style.display = "none";
    assignedToInput.style.borderBottom = "1px solid rgb(204, 204, 204)";
    assignedToInput.style.borderRadius = "7px";
  } else if (!contactsDropdownOpen && !contactsOpened) {
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdown.innerHTML = "";
    for (let i = 0; i < storedContactsArray.length; i++) {
      if (i === selectedUserIndex) {
        continue;
      }
      const contact = storedContactsArray[i];
      contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_name.png"> ${contact.userName}</div> <input type="checkbox" class="checkbox-primary"></div>`;
    }
    contactsDropdown.innerHTML += /*html*/ `<div class="contact"><div><img src="assets/img/icon_mail.png"> Invite new contact</div></div>`;
    contactsDropdownOpen = true;
    contactsOpened = true;
  } else {
    assignedToInput.style.borderBottom = "none";
    assignedToInput.style.borderRadius = "7px 7px 0 0";
    contactsDropdown.style.display = "block";
    contactsDropdownOpen = true;
  }
});

//add event listeners to prio items
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

//prio buttons style
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

//subtask functionality

//subtask input field listener
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

//funcitionality of trashbin icon to delete subtask onclick
function removeParent(e) {
  e.target.parentNode.remove();
}

//add listener to create task button
create.addEventListener("click", function () {
  // event.preventDefault();
  formValidation2();
});

clear.addEventListener("click", function () {
  window.location.reload();
});

// modify calendar so you can only select current date or date in the future
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;
document.getElementById("date").min = today;

let requiredShown = false;
let columnName = "toDo";

async function createTask() {
  let rgb = window
    .getComputedStyle(categoryDot)
    .getPropertyValue("background")
    .match(/\d+/g)
    .map(Number);

  //let rbgTaskCategory = bgTaskCategory.match(/\d+/g).map(Number);
  let prio = document.querySelector(".active");
  let priorityBg;
  let prioIconSrcTask;
  let prioIconSrcPopup;
  let prioUrgent;
  let prioMedium;
  let prioLow;
  let bgTaskCategory = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

  let selectedContacts = [storedContactsArray[selectedUserIndex].userName];
  let avatarColors = [storedContactsArray[selectedUserIndex].color];

  storedContactsArray.splice(selectedUserIndex, 1);

  let checkboxes = document.querySelectorAll(".checkbox-primary");
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    if (checkbox.checked) {
      selectedContacts.push(storedContactsArray[i].userName);
      avatarColors.push(storedContactsArray[i].color);
    }
  }

  let subtasks = [];
  let subtasksChecked = [];
  let createdSubtasks = document.querySelectorAll(".subtask-counter");
  for (let i = 0; i < createdSubtasks.length; i++) {
    const subtask = createdSubtasks[i].innerText.replace(/\s*\u25CB\s*/g, "");
    subtasks.push(subtask);
    subtasksChecked.push(false);
  }

  if (prio.innerText == "Urgent") {
    priorityBg = "#ff3d00";
    prioIconSrcTask = "arrow-up-red.png";
    prioIconSrcPopup = "arrow-up-white.png";
    prioUrgent = true;
    prioMedium = false;
    prioLow = false;
  } else if (prio.innerText == "Medium") {
    priorityBg = "#fea800";
    prioIconSrcTask = "equal-sign-orange.svg";
    prioIconSrcPopup = "equal-sign-white.svg";
    prioUrgent = false;
    prioMedium = true;
    prioLow = false;
  } else {
    priorityBg = "#79e228";
    prioIconSrcTask = "arrow-down-green.png";
    prioIconSrcPopup = "arrow-down-white.svg";
    prioUrgent = false;
    prioMedium = false;
    prioLow = true;
  }

  let newTask = {
    taskCategory: categoryInput.value,
    bgTaskCategory: bgTaskCategory,
    taskTitle: title.value,
    taskDescription: description.value,
    priority: prio.innerText,
    priorityBg: priorityBg,
    prioIconSrcTask: prioIconSrcTask,
    prioIconSrcPopup: prioIconSrcPopup,
    prioUrgent: prioUrgent,
    prioMedium: prioMedium,
    prioLow: prioLow,
    date: date.value,
    names: selectedContacts,
    bGcolorsOfAvatar: avatarColors,
    column: columnName,
    id: tasks.length,
    subtasks: subtasks,
    subtasksChecked: subtasksChecked,
  };

  tasks.push(newTask);
  await backend.setItem("keyTasks", JSON.stringify(tasks));
  //   closeAddTask();

  columnName = "toDo";
  window.location.href = "board.html";
}

function formValidation2() {
  if (checkInputs()) {
    createTask();
  } else {
    showRequired();
  }
}

function checkInputs() {
  let allCorrect = true;
  let prio = document.querySelector(".active");
  let data = [title, description, categoryInput, date];
  for (let i = 0; i < data.length; i++) {
    const input = data[i];
    if (
      !input.value ||
      input.value == "Select task category" ||
      input.value == ""
    ) {
      allCorrect = false;
    }
  }
  if (prio == undefined) {
    allCorrect = false;
  }

  return allCorrect;
}

function showRequired() {
  requiredShown = true;
  let prio = document.querySelector(".active");
  let required = document.getElementsByClassName("required");
  let data = [title, description, categoryInput, date, assignedToInput];

  for (let i = 0; i < data.length; i++) {
    const input = data[i];
    if (
      !input.value ||
      input.value == "Select task category" ||
      input.value == "" ||
      input.value == "Select contacts to assign"
    ) {
      required[i].innerText = "This field is required";
    }
  }
  if (prio == undefined || prio.classList.contains("nav-item")) {
    required[required.length - 1].innerText = "Priority Selection is mandatory";
  }
}
