/**
 * Indicates whether the required fields are shown or not.
 * @type {boolean}
 */
let requiredShown = false;

/**
 * Generates a new random color.
 * @returns {string} The generated random color in hex format.
 */
function newColor() {
  var randomColor = "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
  //filterColor(randomColor);
  return randomColor;
}

/**
 * Creates a new task.
 */
async function createTask() {
  let rgb = window
    .getComputedStyle(categoryDot)
    .getPropertyValue("background")
    .match(/\d+/g)
    .map(Number);

  //let rbgTaskCategory = bgTaskCategory.match(/\d+/g).map(Number);
  let prio = document.querySelector(".active");
  let probs = getPriorityValues(prio);
  let bgTaskCategory = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  let selectedContacts = [];

  let checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    if (checkbox.checked) {
      selectedContacts.push(team[i].userName);
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

  let avatarColors = [];
  for (let i = 0; i < selectedContacts.length; i++) {
    avatarColors.push(newColor());
  }

  let newTask = generateTask(
    categoryInput,
    bgTaskCategory,
    title,
    description,
    prio,
    probs,
    date,
    selectedContacts,
    avatarColors,
    "toDo",
    tasks,
    subtasks,
    subtasksChecked
  );

  tasks.push(newTask);
  await backend.setItem("keyTasks", JSON.stringify(tasks));
}

/**
 * Generates a new task object.
 * @param {HTMLElement} categoryInput - The category input element.
 * @param {string} bgTaskCategory - The background color of the task category.
 * @param {HTMLElement} title - The title input element.
 * @param {HTMLElement} description - The description input element.
 * @param {HTMLElement} prio - The active priority button element.
 * @param {object} probs - The priority values object.
 * @param {HTMLElement} date - The date input element.
 * @param {Array} selectedContacts - The selected contacts array.
 * @param {Array} avatarColors - The avatar colors array.
 * @param {string} columnName - The column name.
 * @param {Array} tasks - The tasks array.
 * @param {Array} subtasks - The subtasks array.
 * @param {Array} subtasksChecked - The subtasks checked array.
 * @returns {object} The newly generated task object.
 */
function generateTask(
  categoryInput,
  bgTaskCategory,
  title,
  description,
  prio,
  probs,
  date,
  selectedContacts,
  avatarColors,
  columnName,
  tasks,
  subtasks,
  subtasksChecked
) {
  let newTask = {
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

/**
 * Retrieves the priority values based on the selected priority button.
 * @param {HTMLElement} prio - The active priority button element.
 * @returns {object} The priority values object.
 */
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
 * Performs form validation and triggers task creation if all inputs are valid.
 */
function formValidation() {
  if (checkInputs()) {
    showSuccessAnimation();
    createTask();
    setTimeout(() => {
      window.location.href = "board.html";
    }, 2500);
  } else {
    showRequired();
  }
}

/**
 * Shows a success animation when a task is added to the board.
 */
function showSuccessAnimation() {
  let animationContainer = document.createElement("div");
  animationContainer.classList.add("alert");
  animationContainer.innerHTML = /*html*/ `
    Task added to board
    <img src="assets/img/icon_board.png">
  `;
  document.body.append(animationContainer);
}

/**
 * Checks if all input fields are filled correctly.
 * @returns {boolean} True if all inputs are correct, false otherwise.
 */
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

/**
 * Shows the required fields if they are not filled.
 */

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

window.addEventListener("click", function () {
  if (requiredShown) {
    let required = this.document.querySelectorAll(".required");
    [...required].forEach((e) => {
      e.innerText = "";
    });
    requiredShown = false;
  }
});
