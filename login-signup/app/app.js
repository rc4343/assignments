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
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.text;
    editInput.style.display = 'none';
    const editButton = document.createElement('button');
    editButton.innerHTML = '&#9998;'; // Edit symbol (&#9998; or &#x270D;)
    editButton.classList.add('edit');
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&#10005;'; // Cross symbol (&#10005; or &#x274C;)
    deleteButton.classList.add('delete');
    li.appendChild(taskText);
    li.appendChild(editInput);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    li.dataset.taskId = task.id;
    if (task.completed) {
      li.classList.add('completed');
    }
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
  if (e.target.tagName.toLowerCase() === 'button' && e.target.classList.contains('edit')) {
    const li = e.target.parentElement;
    const taskText = li.querySelector('span');
    const editInput = li.querySelector('input');
    taskText.style.display = 'none';
    editInput.style.display = 'inline';
    editInput.focus();
    const blurHandler = () => {
      if (editInput.value.trim() === '') {
        editInput.value = taskText.textContent;
      } else {
        const taskId = li.dataset.taskId;
        updateTask(taskId, editInput.value.trim());
        taskText.textContent = editInput.value.trim();
      }
      taskText.style.display = 'inline';
      editInput.style.display = 'none';
      editInput.removeEventListener('blur', blurHandler);
    };
    editInput.addEventListener('blur', blurHandler);
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
