/**
 * This file handles all the rendering (tasks, popups etc.).
 * It mostly contains HTML templates.
 */

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

function renderTasks(taskArea, filterdArray) {
  document.getElementById(taskArea).innerHTML = "";
  for (let i = 0; i < filterdArray.length; i++) {
    const task = filterdArray[i];
    const taskCategory = task["taskCategory"];
    const taskTitle = task["taskTitle"];
    const taskDescription = task["taskDescription"];
    const prioIconTaskSrc = task["prioIconSrcTask"];
    const prioIconPopupSrc = task["prioIconSrcPopup"];
    const priorityTaskPopup = task["priority"];
    const priorityBg = task["priorityBg"];
    const names = task["names"];
    const backgroundColor = task["bGcolorsOfAvatar"];
    const backgroundColorCategory = task["bgTaskCategory"];
    const date = task["date"];
    const id = task["id"];
    const subtasks = task.subtasks;
    const subtasksChecked = task.subtasksChecked;
    document.getElementById(taskArea).innerHTML += /*html*/ `
            <div id="task${id}" draggable="true" ondrag="dragging(${id})"  ondragstart="startDragging(${id},event)"  onclick="openTaskPopup(${id})" class="task"></div>
                <div id="layoverTaskPopup${id}" onclick="stopPropagation(event)" class="layover-task-popup d-none"></div>
            </div> `;
    renderHTML(
      id,
      backgroundColorCategory,
      taskCategory,
      taskTitle,
      taskDescription,
      prioIconTaskSrc,
      names,
      backgroundColor,
      date,
      priorityBg,
      priorityTaskPopup,
      prioIconPopupSrc,
      subtasksChecked,
      subtasks
    );
  }
}

function renderHTML(
  id,
  backgroundColorCategory,
  taskCategory,
  taskTitle,
  taskDescription,
  prioIconTaskSrc,
  names,
  backgroundColor,
  date,
  priorityBg,
  priorityTaskPopup,
  prioIconPopupSrc,
  subtasksChecked,
  subtasks
) {
  renderTasksForArea(
    id,
    backgroundColorCategory,
    taskCategory,
    taskTitle,
    taskDescription,
    prioIconTaskSrc
  );
  renderAvatars(names, id, backgroundColor);
  renderLayoverTaskPopup(id);
  renderTaskPopup(
    id,
    backgroundColorCategory,
    taskCategory,
    taskTitle,
    date,
    taskDescription
  );
  renderAvatarsTaskPopup(id, names, backgroundColor);
  renderSubtasks(id, subtasks, subtasksChecked);
  renderProgressBar(id, subtasksChecked, subtasks);
  renderEditContainer(id);
  renderInput(id, date);
  renderSelectPanel(id);
  renderSelectContact(id, names);
  renderPriorityContainer(id, priorityBg, priorityTaskPopup, prioIconPopupSrc);
  renderPrioButtons(id);
}

function renderTasksForArea(
  id,
  backgroundColorCategory,
  taskCategory,
  taskTitle,
  taskDescription,
  prioIconTaskSrc
) {
  document.getElementById("task" + id).innerHTML = /*html*/ `
      <div id="categoryContainer${id}" class="categoryTask-container">
                    <div>
                        <div class="categoryTask" style="background-color:${backgroundColorCategory}">${taskCategory}</div>
                    </div>
                    </div>
                    <div id="taskTitle${id}" class="task-title">${taskTitle}</div>
                    <div id="descriptionTask${id}" class="description">${taskDescription}</div>
                    <div id="myProgressBar${id}" class="my-progress-bar"></div>

                    <div class="avatar-container">
                          <div style="display:flex">
                              <div id="avatar${id}" class="avatar"></div>
                              <div id="avatarPlus${id}"></div>
                          </div>
                          <img id="prioIconOnTask${id}" src="assets/img/${prioIconTaskSrc}">`;
}

function renderLayoverTaskPopup(id) {
  document.getElementById("layoverTaskPopup" + id).innerHTML = /*html*/ `
    <div id="contentTaskPopup${id}" onclick="stopPropagation(event)" class="content-task-popup d-none "></div>
    <div id="editContainerWrapper${id}" onclick="stopPropagation(event)"class="edit-container-wrapper d-none">
        <div id="editContainer${id}" class="edit-container " onclick="stopPropagation(event)"></div>
        <svg  class="ok-button"  onclick="editFinish(${id})" width="85" height="51" viewBox="0 0 85 51" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="85" height="51" rx="10" fill="#2A3647"/>
<path d="M25.3622 25.3636C25.3622 27.0291 25.0465 28.446 24.4151 29.6143C23.7887 30.7827 22.9336 31.6751 21.8498 32.2915C20.771 32.9031 19.5579 33.2088 18.2106 33.2088C16.8533 33.2088 15.6353 32.9006 14.5565 32.2841C13.4776 31.6676 12.625 30.7752 11.9986 29.6069C11.3722 28.4386 11.0589 27.0241 11.0589 25.3636C11.0589 23.6982 11.3722 22.2812 11.9986 21.1129C12.625 19.9446 13.4776 19.0547 14.5565 18.4432C15.6353 17.8267 16.8533 17.5185 18.2106 17.5185C19.5579 17.5185 20.771 17.8267 21.8498 18.4432C22.9336 19.0547 23.7887 19.9446 24.4151 21.1129C25.0465 22.2812 25.3622 23.6982 25.3622 25.3636ZM22.0884 25.3636C22.0884 24.2848 21.9268 23.375 21.6037 22.6342C21.2855 21.8935 20.8356 21.3317 20.2539 20.9489C19.6722 20.5661 18.9911 20.3746 18.2106 20.3746C17.43 20.3746 16.7489 20.5661 16.1673 20.9489C15.5856 21.3317 15.1332 21.8935 14.81 22.6342C14.4918 23.375 14.3327 24.2848 14.3327 25.3636C14.3327 26.4425 14.4918 27.3523 14.81 28.093C15.1332 28.8338 15.5856 29.3956 16.1673 29.7784C16.7489 30.1612 17.43 30.3526 18.2106 30.3526C18.9911 30.3526 19.6722 30.1612 20.2539 29.7784C20.8356 29.3956 21.2855 28.8338 21.6037 28.093C21.9268 27.3523 22.0884 26.4425 22.0884 25.3636ZM27.7542 33V17.7273H30.9832V24.4613H31.1846L36.6807 17.7273H40.551L34.8834 24.5657L40.6182 33H36.7552L32.5716 26.7209L30.9832 28.6598V33H27.7542Z" fill="white"/>
<path d="M55 25.5L61 31.5L71 19.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 </div>`;
}

function renderTaskPopup(
  id,
  backgroundColorCategory,
  taskCategory,
  taskTitle,
  date,
  taskDescription
) {
  document.getElementById("contentTaskPopup" + id).innerHTML = /*html*/ `
    <div class="trash-popup d-none" onclick="stopPropagation(event)" id="trashPopup${id}"> Are you sure you want to delete this Task?
       <div class="deleteNoYes">
           <button id="no${id}" onclick="noDelete(${id})">No</button>
           <button id="yes${id}" onclick="yesDelete(${id})">Yes</button>
        </div>
    </div>
    <div class="category-trash">
         <div class="categoryTask set-category" style="background-color:${backgroundColorCategory}" >${taskCategory}</div>
    <div onclick="trashPopup(${id})" class="trash"><img src="assets/img/trash.png" alt=""></div>
    </div> 
    <img class="exit-task-popup" onclick="closeTaskPopup(${id})" src="assets/img/exit.png">
    <div id="taskTitlePopupContainer${id}" class="task-title set-title"  >${taskTitle}</div>
    <div id="descriptionPopup${id}" class="description set-description">${taskDescription}</div>
    <div class="dateContainer">
        <div id="dueDate${id}" class="due-date set-fonts">Due date:</div>
        <div class="due-date-set" id="dueDateSet${id}">${date}</div>
    </div>
    <div id="priorityContainer${id}" class="priority-container set-fonts"></div>
    <div id="subtaskContainer${id}" class="subtask-wrapper"><div class="set-fonts">Subtasks:</div></div>
    <div id="assignedTo${id}" class="assigned-to set-fonts">Assigned To:</div>
    <svg id="editTask${id}" class="edit-button" onclick="editTask(${id})" width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect class="edit-button" width="57" height="57" rx="10" fill="#2A3647"/>
<path d="M20.9449 35.5155L25.7643 38.4404L38.4074 17.6083C38.694 17.1362 38.5435 16.5211 38.0714 16.2346L34.9618 14.3474C34.4897 14.0608 33.8746 14.2113 33.5881 14.6834L20.9449 35.5155Z" fill="white"/>
<path d="M20.3599 36.4792L25.1792 39.4041L20.4506 41.6889L20.3599 36.4792Z" fill="white"/>
</svg>
      `;
}

function renderEditContainer(id) {
  document.getElementById("editContainer" + id).innerHTML = /*html*/ `
    <img class="exit-edit-container" onclick="closeTaskPopup(${id}) ; closeEditContainer(${id})" src="assets/img/exit.png">
    <div class="mbt-7">Title</div>
    <form class="form-edit-container"id="formContainer${id}" style="display: flex; flex-direction: column;" onsubmit="editFinish(${id}) ; return false;" ></form>
    <div class="mbt-7">Prio</div>
    <div id="prioContainer${id}" class="prio-container"></div>
    <div class="mbt-7">Assigned to</div>
    <div id="selectContainer${id}" class="selectContainer"></div>`;
}

function renderPriorityContainer(
  id,
  priorityBg,
  priorityTaskPopup,
  prioIconPopupSrc
) {
  document.getElementById("priorityContainer" + id).innerHTML = /*html*/ `
    <div>Priority:</div>
    <div id="prioUrgentTaskPopup${id}" class="prio-urgent-task-popup prio-setup  " style="background-color:${priorityBg}">${priorityTaskPopup} <img
           src="assets/img/${prioIconPopupSrc}"></div>`;
}

function renderInput(id, date) {
  document.getElementById("formContainer" + id).innerHTML = /*html*/ `
    <input required id="titleInput${id}" class="title-input " type="text">
    <div class="mbt-7">Description</div>
    <textarea required 
          id="textAreaDescription${id}" class="text-area-description" name="" cols="40" rows="5"></textarea>
    <div class="mbt-7">Due date</div>
   <input required id="dateInput${id}" class="date-input" value="${date}" type="date">`;
   let today = new Date();
   let dd = String(today.getDate()).padStart(2, "0");
   let mm = String(today.getMonth() + 1).padStart(2, "0");
   let yyyy = today.getFullYear();
   today = yyyy + "-" + mm + "-" + dd;
   document.getElementById(`dateInput${id}`).min = today;
}
 
function renderSelectPanel(id) {
  document.getElementById("selectContainer" + id).innerHTML = /*html*/ `
    <div id="option${id}" class="option optionPlus" onclick="dropDown(${id})">
        <div class="selectContact contactName">Select contacts to assign</div>
        <button id="button${id}" class="button">
        <img id="img${id}" class="img" src="assets/img/arrow-down-black.png" alt="">
        </button>
    </div>
    <div id="listOfPersons${id}" class="list-of-persons"></div>`;

}

function renderSelectContact(id, names) {
  document.getElementById("listOfPersons" + id).innerHTML = "";
  contacts.forEach((c) => {
    document.getElementById("listOfPersons" + id).innerHTML += /*html*/ `
     <div class="nameOfEditContainer">
     <div class="user-name-edit-container" id="userNameEditContainer${id}">${c.userName}</div> 
     <input class="checkbox-edit-container" type="checkbox" id="checkboxEditContainer${id}">
     </div>
    `;
  });
  let checkboxes= document.getElementsByClassName('checkbox-edit-container');
  for (let i = 0; i < contacts.length; i++) {
    if(contacts[i].userName== names[i]) {
      checkboxes[i].checked = true;
    }
  }
  
}

function renderProgressBar(id, subtasksChecked, subtasks) {
  let progressBarContainer = document.getElementById("myProgressBar" + id);
  let subtaskCounter = 0;
  if (subtasks.length > 0) {
    for (let i = 0; i < subtasksChecked.length; i++) {
      const element = subtasksChecked[i];
      if (element) {
        subtaskCounter++;
      }
    }
    progressBarContainer.innerHTML = progress(id, subtaskCounter, subtasks);
  } else {
    progressBarContainer.innerHTML = /*html*/ `<div class="progress-container-empty"></div>`;
  }
}

function progress(id, subtaskCounter, subtasks) {
  let width = 0;
  if (subtasks.length > 0 && subtaskCounter > 0) {
    width = (subtaskCounter / subtasks.length) * 100;
  }

  return /*html*/ `
    <div class="progress-container">
         <div class="progress-blue" style="width:${width}%"></div>
   </div>
   <div id="progressBarDone${id}" class="progress-bar-done">
         <div>${subtaskCounter}/${subtasks.length} Done</div>
    </div>`;
}

function renderAvatars(names, id, backgroundColor) {
  for (let index = 0; index < names.length; index++) {
    const name = names[index];
    const firstLetterOfFirstName = name.split("", 1);
    const fullName = name.split(" ");
    const firstLetterOfLastName = fullName[1].split("", 1);
    if (index >= 2) {
      document.getElementById("avatarPlus" + id).innerHTML = `
              <div  class="color" style="background-color:black; width:16px"><div>+ ${
                index - 1
              }</div></div>`;
    } else {
      document.getElementById("avatar" + id).innerHTML += `
            <div id="color${index}" class="color" style="background-color:
               ${backgroundColor[index]}">
               ${firstLetterOfFirstName}${firstLetterOfLastName}</div> `;
    }
  }
}

function renderSubtasks(id, subtasks, subtasksChecked) {
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    const isChecked = subtasksChecked[i];
    const checkboxHtml = isChecked ? "checked" : "";

    document.getElementById("subtaskContainer" + id).innerHTML += /*html*/ `
                <div class="subtask-container">
                    <input class="subtask-checkbox-${id}" type="checkbox" ${checkboxHtml}>
                    <p>${subtask}</p>
                </div>
            `;
  }
}

function renderAvatarsTaskPopup(id, names, backgroundColor) {
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const firstLetterOfFirstName = name.split("", 1);
    const fullName = name.split(" ");
    const firstLetterOfLastName = fullName[1].split("", 1);
    document.getElementById("assignedTo" + id).innerHTML += /*html*/ `
         <div class="avatar-name">
               <div id="avatarTaskPopup${i}" class="set-color" style="background-color:
          ${backgroundColor[i]}">${firstLetterOfFirstName}${firstLetterOfLastName}</div>
                <div>${name}</div>
          </div> `;
  }
}

function renderPrioButtons(id) {
  document.getElementById("prioContainer" + id).innerHTML += /*html*/ `
    <div onclick="prioButtonChecker(${id}, 'urgent')"
    id="urgent${id}"
    class="urgent prio-buttons ">Urgent
    <img id="prioArrowRed${id}" class="prio-arrow-red" src="assets/img/arrow-up-red.png">
    <img id="prioArrowWhite${id}" class="prio-arrow-white d-none"
        src="assets/img/arrow-up-white.png">
    </div>
       
    <div onclick="prioButtonChecker(${id}, 'medium')"
    id="medium${id}"
    class="medium prio-buttons">Medium
    <img id="prioEqualSignOrange${id}" class="prio-equal-sign-orange"
        src="assets/img/equal-sign-orange.png">
    <img id="prioEqualSignWhite${id}" class="prio-equal-sign-white d-none"
        src="assets/img/equal-sign-white.svg">
    </div>

    <div onclick="prioButtonChecker(${id}, 'low')"
    id="low${id}"
    class="low prio-buttons">Low
    <img id="prioArrowGreen${id}" class="prio-arrow-green"
        src="assets/img/arrow-down-green.png">
    <img id="prioArrowWhiteDown${id}" class="prio-arrow-white-down d-none"
        src="assets/img/arrow-up-white.png">
    </div>`;
}