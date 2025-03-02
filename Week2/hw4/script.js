const input = document.querySelector("#task-name");
const listContainer = document.querySelector("#list-container");
const taskImportance = document.querySelector("#task-importance");
let data = {};

const addTask = () => {
  saveData();
};

listContainer.addEventListener(
  "click",
  function (e) {
    if (e.target.tagName === "LI") {
      e.target.classList.toggle("checked");
    } else if ((e.target.tagName = "SPAN")) {
      e.target.parentElement.remove();
    }
    saveData();
  },
  false
);

const saveData = () => {
  localStorage.setItem("data", listContainer.innerHTML);
};

const showTasks = () => {
  listContainer.innerHTML = localStorage.getItem("data");
};

const getSelectedImportance = () => {
  const radios = document.getElementsByName("task-importance-level");
  let selectedValue = "";
  for (const radio of radios) {
    if (radio.checked) {
      selectedValue = radio.value;
      break;
    }
  }
  return selectedValue;
};

showTasks();
