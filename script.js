const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let currentFilter = "all";

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task on button click
addBtn.addEventListener("click", addTask);

// Add task on Enter key press
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Enter a task");
    return;
  }

  const tasks = getTasks();
  tasks.push({ text, completed: false });
  saveTasks(tasks);

  taskInput.value = "";
  loadTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  taskList.innerHTML = "";
  let tasks = getTasks();

  // Sort: completed tasks move to bottom
  tasks.sort((a, b) => a.completed - b.completed);

  // Apply filter
  tasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  // Render each task
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.className = "task-text";
    textSpan.onclick = () => toggleTask(index);

    const actions = document.createElement("div");
    actions.className = "actions";

    const edit = document.createElement("span");
    edit.textContent = "✎";
    edit.className = "edit";
    edit.onclick = () => editTask(index);

    const del = document.createElement("span");
    del.textContent = "✖";
    del.className = "delete";
    del.onclick = () => deleteTask(index);

    actions.append(edit, del);
    li.append(textSpan, actions);

    taskList.appendChild(li);
  });
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  loadTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
}

function editTask(index) {
  const tasks = getTasks();
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText;
    saveTasks(tasks);
    loadTasks();
  }
}

function filterTasks(type) {
  currentFilter = type;
  loadTasks();
}
