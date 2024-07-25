// List of background image URLs
const backgroundImages = [
    'Images/Image -1.jpg',
    'Images/Image - 2.jpg',
    'Images/Image - 3.jpg',
    'Images/Image - 4.jpg',
    'Images/Image - 5.jpg',
    'Images/Image - 6.jpg',
    'Images/Image - 7.jpg',
    'Images/Image - 8.jpg',
    'Images/Image - 9.jpg',
    'Images/Image - 10.jpg',
    'Images/Image - 11.jpg',
    'Images/Image - 12.jpg',
    'Images/Image - 13.jpg'
];

function setRandomBackgroundImage() {
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = backgroundImages[randomIndex];
    document.body.style.backgroundImage = `url('${selectedImage}')`;
}

setRandomBackgroundImage();

function displayDateAndGreeting() {
    const dateContainer = document.getElementById('currentDate');
    const greetingContainer = document.getElementById('greeting');
    const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString(undefined, options);
    dateContainer.innerText = formattedDate;
    
    const hours = now.getHours();
    let greeting = 'Hello';
    if (hours < 12) {
        greeting = 'Good Morning, Buddy';
    } else if (hours < 18) {
        greeting = 'Good Afternoon, Buddy';
    } else {
        greeting = 'Good Evening, Buddy';
    }
    greetingContainer.innerText = greeting;
}

displayDateAndGreeting();

document.getElementById('addTaskButton').addEventListener('click', addTask);
document.getElementById('clearAllButton').addEventListener('click', clearAllTasks);
document.getElementById('taskInput').addEventListener('keydown', handleEnterKey);
document.getElementById('searchBar').addEventListener('input', filterTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const taskId = Date.now().toString();
    const task = {
        id: taskId,
        text: taskText,
        completed: false
    };

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskInput.value = '';
    displayTask(task);
    checkClearAllButtonVisibility();
}

function displayTask(task) {
    const taskList = document.getElementById('taskList');

    const li = document.createElement('li');
    li.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const span = document.createElement('span');
    span.innerText = task.text;

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.innerText = '✏️';
    editButton.addEventListener('click', () => editTask(task.id));

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerText = '🗑️';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);

    if (task.completed) {
        li.classList.add('completed');
    }
}

function toggleTaskCompletion(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    const taskListItem = document.querySelector(`li[data-id="${id}"]`);
    taskListItem.classList.toggle('completed');
}

function editTask(id) {
    const taskListItem = document.querySelector(`li[data-id="${id}"]`);
    const span = taskListItem.querySelector('span');
    const editButton = taskListItem.querySelector('.edit');

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.classList.add('edit-input');
    editInput.value = span.innerText;

    const saveButton = document.createElement('button');
    saveButton.classList.add('save');
    saveButton.innerText = '💾';

    saveButton.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
            span.innerText = newText;
            saveTask(id, newText);
        }
        editInput.replaceWith(span);
        saveButton.replaceWith(editButton);
    });

    span.replaceWith(editInput);
    editInput.focus();
    editButton.replaceWith(saveButton);
}

function saveTask(id, newText) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            task.text = newText;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    const taskListItem = document.querySelector(`li[data-id="${id}"]`);
    taskListItem.remove();
    checkClearAllButtonVisibility();
}

function clearAllTasks() {
    localStorage.removeItem('tasks');
    document.getElementById('taskList').innerHTML = '';
    checkClearAllButtonVisibility();
}

function handleEnterKey(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function filterTasks() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
    const tasks = document.querySelectorAll('#taskList li');

    tasks.forEach(task => {
        const taskText = task.querySelector('span').innerText.toLowerCase();
        if (taskText.includes(searchQuery)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

function checkClearAllButtonVisibility() {
    const clearAllButton = document.getElementById('clearAllButton');
    const taskList = document.getElementById('taskList');
    if (taskList.children.length === 0) {
        clearAllButton.style.display = 'none';
    } else {
        clearAllButton.style.display = 'inline-block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => displayTask(task));
    checkClearAllButtonVisibility();
});
