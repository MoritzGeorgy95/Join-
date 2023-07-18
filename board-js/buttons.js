/**
 * This file handles all button events on the board that are unrelated to adding a new task
 */

//open add task layover and make sure task is added directly to correct column
function addTask(column) {
  columnName = column;
  document.getElementById("layover").classList.remove("d-none");

  let label = document.querySelectorAll("label");
  for (let index = 0; index < label.length; index++) {
    label[index].classList.add("mt-15-plus");
  }
  document.getElementById("taskCard").classList.add("task-card-plus");
}

//closing add task popup when clicking on layover
function closeAddTask() {
  window.location.reload();
}

//handle end of editing a task task (close layover and save new task info)

//function way too long/ add indirect recursion and early return pattern
async function editFinish(id) {
  let titleInput = document.getElementById("titleInput" + id);
  let descriptionInput = document.getElementById("textAreaDescription" + id);
  let contactsSelected = false;
  let checkboxes = document.getElementsByClassName("checkbox-edit-container");
  [...checkboxes].forEach((c) => {
    if (c.checked) {
      contactsSelected = true;
    }
  });

  if (titleInput.value == "" || descriptionInput.value == "") {
    titleInput.placeholder = "This field is required";
    titleInput.classList.add("placehoder-color-red");
    descriptionInput.placeholder = "This field is required";
    descriptionInput.classList.add("placehoder-color-red");
  } else if (!contactsSelected) {
    document.getElementById("selectContainer" + id).style.borderColor = "red";
  } else {
    updateForTasks(id);
    await addServer();
    window.location.reload();
  }
}

//show task details
function openTaskPopup(id) {
  document.getElementById("layoverTaskPopup" + id).classList.remove("d-none");
  document.getElementById("contentTaskPopup" + id).classList.remove("d-none");
  document.body.style = "overflow: hidden";
  document.getElementsByClassName("header")[0].style.zIndex = "0";
  document.getElementById(
    "titleInput" + id
  ).value = `${tasks[id]["taskTitle"]}`;
  document.getElementById(
    "textAreaDescription" + id
  ).innerHTML = `${tasks[id]["taskDescription"]} `;
}

//close contact details
function closeTaskPopup(id) {
  document
    .getElementById("selectContainer" + id)
    .classList.remove("selectContainerPlus"); // select Panel wird zugemacht
  document.getElementById("layoverTaskPopup" + id).classList.add("d-none");
  document.getElementById("contentTaskPopup" + id).classList.add("d-none");
  document.body.style = "overflow: visible";
  document.getElementsByClassName("header")[0].style.zIndex = "10";
  if (tasks[id]) {
    document
      .getElementById("titleInput" + id)
      .classList.remove("placehoder-color-red");
    document
      .getElementById("textAreaDescription" + id)
      .classList.remove("placehoder-color-red");
    document.getElementById("dateInput" + id).value = tasks[id]["date"];
    document.getElementById("dateInput" + id).style = "color: lightgray";
    getSubtaskCheckboxes(id);
  }
}

//check if user has marked a checkbox as checked on closing task popup
async function getSubtaskCheckboxes(id) {
  let checkboxes = document.querySelectorAll(".subtask-checkbox-" + id);
  let currentTask = tasks[id];
  let subtasksChecked = currentTask.subtasksChecked;
  if (checkboxes.length > 0) {
    for (let i = 0; i < checkboxes.length; i++) {
      let checkbox = checkboxes[i];
      if (checkbox.checked) {
        subtasksChecked[i] = true;
      } else {
        subtasksChecked[i] = false;
      }
    }
    await backend.setItem("keyTasks", JSON.stringify(tasks));
    updateHTML();
  }
}

//this is needed to close overlays but not trigger this effect on click actions within a popup
function stopPropagation(event) {
  event.stopPropagation();
}

//open edit  task popup
function editTask(id) {
  document.getElementById("contentTaskPopup" + id).classList.add("d-none");
  document
    .getElementById("editContainerWrapper" + id)
    .classList.remove("d-none");
  document.getElementById("editContainer" + id).classList.remove("d-none");
  if (tasks[id]["prioUrgent"]) {
    displayButton(id, "urgent-red");
  }
  if (tasks[id]["prioMedium"]) {
    displayButton(id, "medium-orange");
  }
  if (tasks[id]["prioLow"]) {
    displayButton(id, "low-green");
  }
}

//close edit task popup
function closeEditContainer(id) {
  document.getElementById("layoverTaskPopup" + id).classList.add("d-none");
  document.getElementById("editContainerWrapper" + id).classList.add("d-none");
  document.getElementById("editContainer" + id).classList.add("d-none");
}

//assigned contacts dropdown
function dropDown(id) {
  document
    .getElementById("selectContainer" + id)
    .classList.toggle("selectContainerPlus");
}

//check which priority the button has
function prioButtonChecker(id, priority) {
  if (priority === "urgent") {
    setColor(id, true, false, false);
  } else if (priority === "medium") {
    setColor(id, false, true, false);
  } else if (priority === "low") {
    setColor(id, false, false, true);
  }
}

//set the corresponding color
function setColor(id, colorUrgent, colorMedium, colorLow) {
  tasks[id]["prioUrgent"] = colorUrgent;
  tasks[id]["prioMedium"] = colorMedium;
  tasks[id]["prioLow"] = colorLow;
  applyStyles(id, colorUrgent, colorMedium, colorLow);
}

//apply all styles and hide other buttons
function applyStyles(id, colorUrgent, colorMedium, colorLow) {
  if (colorUrgent) {
    showButton(id, "urgent");
  } else if (colorMedium) {
    showButton(id, "medium");
  } else if (colorLow) {
    showButton(id, "low");
  }
}

//show selected button
function showButton(id, condition) {
  hideAll(id);
  if (condition == "urgent") {
    displayButton(id, "urgent-red");
  } else if (condition == "medium") {
    displayButton(id, "medium-orange");
  } else if (condition == "low") {
    displayButton(id, "low-green");
  }
}

//hide all buttons
function hideAll(id) {
  document.getElementById("prioArrowRed" + id).classList.remove("d-none");
  document.getElementById("prioArrowWhite" + id).classList.add("d-none");
  document
    .getElementById("urgent" + id)
    .classList.remove("urgent-red", "button-shadow");
  document
    .getElementById("prioEqualSignOrange" + id)
    .classList.remove("d-none");
  document.getElementById("prioEqualSignWhite" + id).classList.add("d-none");
  document
    .getElementById("medium" + id)
    .classList.remove("medium-orange", "button-shadow");
  document.getElementById("prioArrowGreen" + id).classList.remove("d-none");
  document.getElementById("prioArrowWhiteDown" + id).classList.add("d-none");
  document
    .getElementById("low" + id)
    .classList.remove("low-green", "button-shadow");
}

//show the respective buttons
function displayButton(id, type) {
  switch (type) {
    case "urgent-red":
      document.getElementById("prioArrowRed" + id).classList.add("d-none");
      document.getElementById("prioArrowWhite" + id).classList.remove("d-none");
      document
        .getElementById("urgent" + id)
        .classList.add("urgent-red", "button-shadow");
      break;
    case "medium-orange":
      document
        .getElementById("prioEqualSignOrange" + id)
        .classList.add("d-none");
      document
        .getElementById("prioEqualSignWhite" + id)
        .classList.remove("d-none");
      document
        .getElementById("medium" + id)
        .classList.add("medium-orange", "button-shadow");
      break;
    case "low-green":
      if (tasks[id]["prioLow"]) {
        document.getElementById("prioArrowGreen" + id).classList.add("d-none");
        document
          .getElementById("prioArrowWhiteDown" + id)
          .classList.remove("d-none");
        document
          .getElementById("low" + id)
          .classList.add("low-green", "button-shadow");
      }
      break;
  }
}

//add new info to server
function showButtonOnTaskPopup(id) {
  if (tasks[id]["prioUrgent"]) {
    addServerPrioUrgent(id);
  } else if (tasks[id]["prioMedium"]) {
    addServerPrioMedium(id);
  } else if (tasks[id]["prioLow"]) {
    addServerPrioLow(id);
  }
}

//search task funtionality
function searchTask() {
  document.getElementById("searchMenu").style = "border: 1px solid lightgray";
  let inputOfSearch = document.getElementById("searchTask").value;
  inputOfSearch = inputOfSearch.toLowerCase();
  notExist = true;
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    let taskTitle = task["taskTitle"];
    document.getElementById("searchTask").placeholder = "Find task";
    document
      .getElementById("searchTask")
      .classList.remove("placehoder-color-red");
    document.getElementById("task" + task["id"]).classList.add("d-none");
    if (taskTitle.toLowerCase().includes(inputOfSearch)) {
      inputIsIncludes(task);
    } else if (notExist) {
      inputIsNotExist(task);
    }
  }
}

//check if input has been edited
function inputRequired(task) {
  document.getElementById("searchMenu").style = "border: 2px solid red";
  document.getElementById("searchTask").placeholder = "This field is required";
  document.getElementById("searchTask").classList.add("placehoder-color-red");
  document.getElementById("task" + task["id"]).classList.remove("d-none");
  notExist = false;
}

function inputIsIncludes(task) {
  document.getElementById("task" + task["id"]).classList.remove("d-none");
  document.getElementById("searchMenu").style = "border: 1px solid lightgray";
  document
    .getElementById("searchTask")
    .classList.remove("placehoder-color-red");
  notExist = false;
}

function inputIsNotExist(task) {
  document.getElementById("searchMenu").style = "border: 2px solid red";
  document.getElementById("searchTask").placeholder = "Task does not exist!";
  document.getElementById("searchTask").classList.add("placehoder-color-red");
  document.getElementById("task" + task["id"]).classList.add("d-none");
}

function trashPopup(id) {
  document.getElementById("trashPopup" + id).classList.remove("d-none");
  document.getElementById("trashPopup" + id).classList.add("trash-popup");
}

async function deleteTask(id) {
  document.getElementById("task" + id).classList.add("d-none");
  closeTaskPopup(id);
  tasks.splice(id, 1);
  tasks.forEach((task, index) => {
    task["id"] = index;
  });
  await addServer();
  updateHTML();
}

function noDelete(id) {
  document.getElementById("trashPopup" + id).classList.add("d-none");
}

function yesDelete(id) {
  document.getElementById("trashPopup" + id).classList.add("d-none");
  deleteTask(id);
}

function contactSpecification(id) {
  let checkboxes = document.getElementsByClassName("checkbox-edit-container");
  let task = tasks[id];
  task.names = [];
  task.bGcolorsOfAvatar = [];
  for (let i = 0; i < checkboxes.length; i++) {
    let checkbox = checkboxes[i];
    if (checkbox.checked) {
      task.names.push(contacts[i].userName);
      task.bGcolorsOfAvatar.push(contacts[i].color);
    }
  }
}
