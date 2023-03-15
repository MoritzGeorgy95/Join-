/**
 * This file contains a bunch of helper functions
 * needed for correctly rendering all tasks.
 */

function addServerPrioUrgent(id) {
  tasks[id]["priority"] = "Urgent";
  tasks[id]["priorityBg"] = "#ff3d00";
  tasks[id]["prioIconSrcPopup"] = "arrow-up-white.png";
  tasks[id]["prioIconSrcTask"] = "arrow-up-red.png";
}

function addServerPrioMedium(id) {
  tasks[id]["priority"] = "Medium";
  tasks[id]["priorityBg"] = "#fea800";
  tasks[id]["prioIconSrcPopup"] = "equal-sign-white.svg";
  tasks[id]["prioIconSrcTask"] = "equal-sign-orange.svg";
}

function addServerPrioLow(id) {
  tasks[id]["priority"] = "Low";
  tasks[id]["priorityBg"] = "#79e228";
  tasks[id]["prioIconSrcPopup"] = "arrow-down-white.svg";
  tasks[id]["prioIconSrcTask"] = "arrow-down-green.png";
}

function updateForTasks(id) {
  if (tasks[id]["prioUrgent"]) {
    addServerPrioUrgent(id);
  }

  if (tasks[id]["prioMedium"]) {
    addServerPrioMedium(id);
  }

  if (tasks[id]["prioLow"]) {
    addServerPrioLow(id);
  }

  dateSpecification(id);
  titleSpecification(id);
  descriptionSpecification(id);
  contactSpecification(id);
}

function dateSpecification(id) {
  let dateInput = document.getElementById("dateInput" + id).value;
  tasks[id]["date"] = dateInput;
}

function titleSpecification(id) {
  let titleValue = document.getElementById("titleInput" + id).value;
  tasks[id]["taskTitle"] = titleValue;
}

function descriptionSpecification(id) {
  let textAreaInput = document.getElementById("textAreaDescription" + id).value;
  tasks[id]["taskDescription"] = textAreaInput;
}

function newColor() {
  var randomColor = "#000000".replace(/0/g, function () {
    return (~~(Math.random() * 16)).toString(16);
  });
  return randomColor;
}

function filterColor(randomColor) {
  for (let i = 0; i < tasks.length; i++) {
    const element = tasks[i];
    let color = element["bGcolorsOfAvatar"];
    if (color.includes(randomColor) || forbiddenColors()) {
      return newColor();
    } else {
      return randomColor;
    }
  }
}

function forbiddenColors() {
  return "#ffffff", "#000000";
}
