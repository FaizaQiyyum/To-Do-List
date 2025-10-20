const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const filterBtns = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Save todos
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render function
function render() {
  list.innerHTML = "";
  const filtered = todos.filter(todo => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  filtered.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    const span = document.createElement("span");
    span.textContent = todo.text;
    span.addEventListener("dblclick", () => editTodo(index));

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      render();
    });

    const del = document.createElement("button");
    del.textContent = "🗑";
    del.addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  });
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, completed: false });
  input.value = "";
  saveTodos();
  render();
}

function editTodo(index) {
  const newText = prompt("Edit your task:", todos[index].text);
  if (newText !== null && newText.trim() !== "") {
    todos[index].text = newText.trim();
    saveTodos();
    render();
  }
}

addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", e => e.key === "Enter" && addTodo());

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
