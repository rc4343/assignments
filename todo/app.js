let todos = [];
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || {};

const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const loginBtn = document.getElementById('login-btn');
const usernameInput = document.getElementById('username');
const registerUserBtn = document.getElementById('register-user-btn');

loginBtn.addEventListener('click', login);
registerUserBtn.addEventListener('click', register);

function login() {
  const username = usernameInput.value.trim();
  if (username && users[username]) {
    currentUser = username;
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
    loadTodos();
    loginBtn.style.display = 'none';
    registerUserBtn.style.display = 'none';
  } else {
    alert('Invalid username or user does not exist');
  }
}

function register() {
  const username = usernameInput.value.trim();
  if (username && !users[username]) {
    users[username] = [];
    localStorage.setItem('users', JSON.stringify(users));
    alert('User created successfully');
  } else {
    alert('Username already exists');
  }
}

function loadTodos() {
  todos = users[currentUser];
  renderTodos();
}

function saveTodos() {
  users[currentUser] = todos;
  localStorage.setItem('users', JSON.stringify(users));
}

function renderTodos() {
  todoList.innerHTML = '';
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = todo;
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => editTodo(index));
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTodo(index));
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    todoList.appendChild(li);
  });
}

addBtn.addEventListener('click', addTodo);

function addTodo() {
  const todo = todoInput.value.trim();
  if (todo) {
    todos.push(todo);
    todoInput.value = '';
    saveTodos();
    renderTodos();
  }
}

function editTodo(index) {
  const newTodo = prompt('Edit todo', todos[index]);
  if (newTodo !== null) {
    todos[index] = newTodo.trim();
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(index) {
  todos.splice(index, 1);
  saveTodos();
  renderTodos();
}