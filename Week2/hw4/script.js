const input = document.querySelector("#task-name");
const listContainer = document.querySelector("#list-container");
const taskImportance = document.querySelector("#task-importance");
const storageName = "task-data-storage";
let data = JSON.parse(localStorage.getItem(storageName)) ?? [];

const addTask = () => {
  const newTask = {
    name: input.value,
    importance: getSelectedImportance(),
  }

  data.push(newTask)

  saveData();
};

const saveData = () => {
  localStorage.setItem(storageName, JSON.stringify(data));
};

const showTasks = () => {
  const tasksHTML = data.map((task) => {
    const currentTaskName = task.name;
    const currentTaskDescription = task.description;
    const currentTaskStatus = task.status;
    const currentTaskImportance = task.importance;

    const currentTaskHTML =
      `<li class="task-${currentTaskImportance} task">
        <input type="checkbox" class="task-importance-checkbox"/>
        <p class="task-name">${currentTaskName}</p>
        <div class="task-action-buttons">
          <span class="remove">X</span>
          <span class="remove">&#9660;</span>
        </div>
      </li>`;

    listContainer.insertAdjacentHTML('beforeend', currentTaskHTML);
  })
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


listContainer.addEventListener(
  "click",
  (e) => {
    if (e.target.tagName === "INPUT") {
      e.target.parentElement.classList.toggle("checked");
    } else if (e.target.tagName === "SPAN") {
      if (window.confirm('Bu taskı silmeyi onaylıyor musunuz?')) {
        const li = e.target.closest('li')
        const ul = li.parentElement;
        const index = Array.from(ul.children).indexOf(li);

        data.splice(index, 1);

        e.target.closest('.task').remove();
      }
    }

    saveData();
  },
  false
);