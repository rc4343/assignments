const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task-button');
const showCompletedTasksCheckbox = document.getElementById('show-completed-tasks');
const sortBySelect = document.getElementById('sort-by-select');

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  renderTaskList();
}

function addTask(task) {
  tasks.push(task);
  saveTasks();
  renderTaskList();
}

function renderTaskList() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.dataset.taskId = task.id;
    if (task.completed) {
      li.classList.add('completed');
    }
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

function updateTask(taskId, newText) {
  const task = tasks.find((task) => task.id === taskId);
  task.text = newText;
  saveTasks();
}

function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(taskIndex, 1);
  saveTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    addTask({ id: Date.now(), text: taskText, completed: false, createdAt: Date.now() });
    newTaskInput.value = '';
  }
});

addTaskButton.addEventListener('click', () => {
  addTaskForm.dispatchEvent(new Event('submit'));
});

taskList.addEventListener('click', (e) => {
  if (e.target.classList.contains('edit')) {
    const taskText = e.target.previousElementSibling.value;
    const taskId = e.target.parentElement.dataset.taskId;
    e.target.previousElementSibling.removeAttribute('disabled');
    e.target.previousElementSibling.focus();
    e.target.previousElementSibling.addEventListener('blur', () => {
      if (e.target.previousElementSibling.value.trim() === '') {
        e.target.previousElementSibling.setAttribute('disabled', 'disabled');
        e.target.previousElementSibling.value = taskText;
      } else {
        updateTask(taskId, e.target.previousElementSibling.value.trim());
      }
    });
  }

  if (e.target.classList.contains('delete')) {
    const taskId = e.target.parentElement.dataset.taskId;
    deleteTask(taskId);
    e.target.parentElement.remove();
  }
});

showCompletedTasksCheckbox.addEventListener('change', () => {
  renderTaskList();
});

sortBySelect.addEventListener('change', () => {
  const sortBy = sortBySelect.value;
  if (sortBy === 'relevance') {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
  } else if (sortBy === 'date') {
    tasks.sort((a, b) => a.createdAt - b.createdAt);
  }
  renderTaskList();
});

function toggleTaskCompletion(taskId) {
  const task = tasks.find((task) => task.id === taskId);

  task.completed = !task.completed;

  saveTasks();

  const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);

  if (task.completed) {

    taskElement.classList.add('completed');

  } else {

    taskElement.classList.remove('completed');

  }

}

tasks.forEach((task) => {

  const taskElement = document.createElement('li');

  taskElement.textContent = task.text;

  taskElement.dataset.taskId = task.id;

  if (task.completed) {

    taskElement.classList.add('completed');

  }

  taskList.appendChild(taskElement);

  taskElement.addEventListener('click', () => {

    toggleTaskCompletion(task.id);

  });

});
