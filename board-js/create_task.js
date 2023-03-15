/**
 * This file handles the actual creation of a new task.
 * Meaning its storage on the server.
 */

//necessary for form validation
let requiredShown = false;

//the default column in board is the toDo column
let columnName = "toDo";

/**
 * Create task gets all the info from the input fields and cleans it up
 */
async function createTask() {
  let rgb = window.getComputedStyle(categoryDot).getPropertyValue("background").match(/\d+/g).map(Number);

  //let rbgTaskCategory = bgTaskCategory.match(/\d+/g).map(Number);
  let prio = document.querySelector(".active");
  let bgTaskCategory = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  let probs= getPriorityValues(prio);
  let selectedContacts = [];
  let avatarColors = [];

  let checkboxes = document.querySelectorAll(".checkbox-primary");
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    if (checkbox.checked) {
      selectedContacts.push(contacts[i].userName);
      avatarColors.push(contacts[i].color);
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

  let newTask = generateTask(categoryInput, bgTaskCategory, title, description, prio, probs, date, selectedContacts, avatarColors, columnName, tasks, subtasks, subtasksChecked);
  
  tasks.push(newTask);
  await backend.setItem("keyTasks", JSON.stringify(tasks));
  columnName = "toDo";
  if (window.innerWidth < 1250) {
    document.getElementById("layover").style.right = "-16px";
  }
  closeAddTask();
}

//helper function to generate new task
function generateTask(categoryInput, bgTaskCategory, title, description, prio, probs, date, selectedContacts, avatarColors, columnName, tasks, subtasks, subtasksChecked) {
  let newTask= {
    taskCategory: categoryInput.value,
    bgTaskCategory: bgTaskCategory,
    taskTitle: title.value,
    taskDescription: description.value,
    priority: prio.innerText,
    priorityBg: probs.priorityBg,
    prioIconSrcTask: probs.prioIconSrcTask,
    prioIconSrcPopup: probs.prioIconSrcPopup,
    prioUrgent: probs.prioUrgent,
    prioMedium: probs.prioMedium,
    prioLow: probs.prioLow,
    date: date.value,
    names: selectedContacts,
    bGcolorsOfAvatar: avatarColors,
    column: columnName,
    id: tasks.length,
    subtasks: subtasks,
    subtasksChecked: subtasksChecked,
  };
  return newTask;
}

//helper function to get priority values 
function getPriorityValues(prio) {
  let props = {};
  switch (prio.innerText) {
    case "Urgent":
      props = {
        priorityBg: "#ff3d00",
        prioIconSrcTask: "arrow-up-red.png",
        prioIconSrcPopup: "arrow-up-white.png",
        prioUrgent: true,
        prioMedium: false,
        prioLow: false,
      };
      break;
    case "Medium":
      props = {
        priorityBg: "#fea800",
        prioIconSrcTask: "equal-sign-orange.svg",
        prioIconSrcPopup: "equal-sign-white.svg",
        prioUrgent: false,
        prioMedium: true,
        prioLow: false,
      };
      break;
    default:
      props = {
        priorityBg: "#79e228",
        prioIconSrcTask: "arrow-down-green.png",
        prioIconSrcPopup: "arrow-down-white.svg",
        prioUrgent: false,
        prioMedium: false,
        prioLow: true,
      };
      break;
  }
  return props;
}

/**
 * Form Validation first checks all inputs for empty or falsy inputs.
 * Only if the checkInputs function returns true, a new task is created.
 * Else, a warning message is shown.
 */

function formValidation() {
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

//show required message below all inputs
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
  if (prio == undefined) {
    required[required.length - 1].innerText = "Priority Selection is mandatory";
  }
}

//remove required message when user clicks again
window.addEventListener("click", function () {
  if (requiredShown) {
    let required = this.document.querySelectorAll(".required");
    [...required].forEach((e) => {
      e.innerText = "";
    });
    requiredShown = false;
  }
});
