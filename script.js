
let TaskRows     = JSON.parse(localStorage.getItem("tasks")) || [];
let taskId       = TaskRows.length? Number(TaskRows[TaskRows.length - 1]?.id) + 1 : 1;
let actionColumn = false;
let Completed    = true;
const btnTask    = document.querySelector(".tasks");
const btnAdd     = document.querySelector(".add");
const btnEdit    = document.querySelector(".edits");
const content    = document.querySelector(".Content");
const form       = document.querySelector(".form");

const renderTasks = (Tasks) => {
  const filteredTasks = Tasks.filter(task => task.completed !== true);
  const RenderTasks=Completed?Tasks:filteredTasks;
  const btn_text=Completed?'Current Tasks':'All Tasks';

  const actionHeader = actionColumn ? "<th>Action</th>" : "";
  const noTasksRow = `<tr><td colspan="4">No Tasks Found🚫</td></tr>`;
  const renderTable = RenderTasks.map(
    (row) => `
        <tr>
          <td>${row.id}</td>
          <td class="${row.completed ? "completed" : ""}">${row.task}</td>
          <td>${row.name}</td>
          ${actionColumn? `
                <td>
                  <input type="checkbox" class="checkbox" data-id="${row.id}" ${row.completed ? "checked" : ""} >
                  <button class="edit bn" data-id="${row.id}" ${row.completed ? "disabled" : ""}>Edit</button>
                  <button class="delete bn" data-id="${row.id}">Delete</button>
                </td>`
                  : ""
      }
    </tr>`
  ).join('');
  content.innerHTML = `
    <button class="btn incomplete">${btn_text}</button>
    <h2>${Completed?'All':'Current'} Tasks</h2>
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Task</th>
          <th>Name</th>
          ${actionHeader}
        </tr> 
      </thead>
      <tbody class="taskTableBody">
        ${RenderTasks.length ? renderTable : noTasksRow}
      </tbody>
    </table>`;

  if (actionColumn) {
    content
      .querySelector(".taskTableBody")
      .addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("edit")) {
          editTask(target.dataset.id);
        } else if (target.classList.contains("delete")) {
          deleteTask(target.dataset.id);
        } else if (target.classList.contains("checkbox")) {
          toggleTaskCompletion(target.dataset.id,RenderTasks);
        }
    });
  }
  const complete = document.querySelector(".incomplete");
  complete.addEventListener("click", ()=>{
    Completed=!Completed
    renderTasks(Tasks)
  });
};

const toggleTaskCompletion = (taskId,Tasks) => {
  const task = TaskRows.find((task) => task.id == taskId);
  if (!task) return;
  task.completed = !task.completed;
  saveTasksToLocalStorage();
  renderTasks(Tasks);
};

const inputTasks = (task = { task: "", name: ""}, isEdit = false) => {
  console.log(task);
  
  const html = `
    <form id="taskForm" class="container form overlay style="background-image: none;">
      <label for="taskInput">Task:</label>
      <input type="text" id="taskInput" name="taskInput" value="${task.task}"  required>
      <br>
      <label for="nameInput">Name:</label>
      <input type="text" id="nameInput" name="nameInput" value="${task.name}" required>
      <button type="submit" class="add">Submit</button>
    </form>`;
  content.innerHTML=html;

  document.getElementById("taskForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("searchInput").value=''
    if (isEdit) {
      updateTask(task.id);
    } else {
      addTask();
    }
  });
};

const addTask = () => {
  const taskInput = document.getElementById("taskInput").value.trim();
  const nameInput = document.getElementById("nameInput").value.trim();
  const task = {
    id: taskId++,
    task: taskInput,
    name: nameInput,
  };
  TaskRows.push(task);
  saveTasksToLocalStorage();
  renderTasks(TaskRows);
};

const editTask = (taskId) => {
  const taskToEdit = TaskRows.find((task) => task.id == taskId);
  if (!taskToEdit) return alert("Task not found!");
  inputTasks(taskToEdit,true)
};
const updateTask=(taskId)=>{
  const taskToEdit = TaskRows.find((task) => task.id == taskId);
  if (!taskToEdit) return alert("Task not found!");
  const updatedTask =document.getElementById("taskInput").value.trim();
  const updatedName = document.getElementById("nameInput").value.trim();
  if (updatedTask !== null && updatedName !== null) {
    taskToEdit.task = updatedTask.trim();
    taskToEdit.name = updatedName.trim();
    saveTasksToLocalStorage();
    renderTasks(TaskRows);
    // toggleActionColumn();
  }}


const deleteTask = (taskId) => {
  if (confirm("Are you sure you want to delete this task?")) {
    TaskRows = TaskRows.filter((task) => task.id != taskId);
    saveTasksToLocalStorage();
    renderTasks(TaskRows);
    // toggleActionColumn();
  }
};

const saveTasksToLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(TaskRows));
};

const toggleActionColumn = () => {
    actionColumn = !actionColumn;
    renderTasks(TaskRows);
};

const filterTasks = () => {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
  const filteredTasks = TaskRows.filter(task => task.name.toLowerCase().includes(searchTerm));  
  renderTasks(filteredTasks);
};


btnTask.addEventListener("click",()=>{
    document.getElementById("searchInput").value=''
    renderTasks(TaskRows)
});
btnEdit.addEventListener("click",()=>{
  document.getElementById("searchInput").value=''
  toggleActionColumn()
});
btnAdd.addEventListener("click", ()=>inputTasks());
document.getElementById("searchInput").addEventListener("input", filterTasks);

window.onbeforeunload = () => {
  content.querySelector(".taskTableBody").removeEventListener('click');
  btnTask.removeEventListener("click");
  btnEdit.removeEventListener("click");
  btnAdd.removeEventListener("click");
  document.getElementById("searchInput").removeEventListener("input");
};

