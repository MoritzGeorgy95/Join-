async function init() {
  await includeHTML();
  navbarToggler();
  tooltip = document.getElementById("tooltip");
}

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

function navbarToggler() {
  const url = window.location.href;
  const currentPage = url.replace(/^(?:\/\/|[^/]+)*\//, "");
  const currentPageClean = currentPage.replace("_", " ").replace(".html", "");
  const menuLinks = document.querySelectorAll(".nav-item");
  [...menuLinks].forEach((item) => {
    if (currentPageClean.includes(item.innerText.toLowerCase())) {
      item.classList.add("active-nav");
    }
  });
}

let logoutOpen = false;
let tooltip;

function openCloseLogout() {
  if (logoutOpen) {
    tooltip.style.display = "none";
    logoutOpen = false;
  } else {
    tooltip.style.display = "block";
    logoutOpen = true;
  }
}

async function logout() {
  setURL(
    "https://moritz-georgy.developerakademie.net/Modul10/smallest_backend_ever"
  );
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  let index = users.findIndex((u) => {
    return u.loggedIn == true;
  });
  if (index !== -1) {
    users[index].loggedIn = false;
    await backend.setItem("users", JSON.stringify(users));
    window.location.href = "index.html";
  } else {
    window.location.href = "index.html";
  }
}
