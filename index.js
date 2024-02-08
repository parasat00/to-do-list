const todo_container = document.querySelector('.todo__content');
const todo_form = document.querySelector(".todo__form");
const todo_add = document.querySelector(".todo__header-nav-btns.add");
const todo_btns = document.querySelectorAll(".todo__header-nav-btns");
const form_exit = document.querySelector(".todo__form-exit");

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const addTask = (e) => {
 e.preventDefault();
 let text = e.target[0].value;

 if(e.target[1].value === "Change") {
  id = e.target.dataset.id;
  tasks[id].body = text;
 }
 else {
  const found = tasks.some(task => task.body === text);
  if(found) { return }
  let task = {
   body: text,
   completed: false
  }
  tasks.push(task);
 }
 e.target[0].value = "";
 e.target.setAttribute("data-id", -1);
 localStorage.setItem('tasks', JSON.stringify(tasks));
 renderTasks();
 todo_form.classList.remove('show');
}

const changeTask = (e) => {
 let id = e.target.parentNode.parentNode.dataset.id;
 let text = tasks[id].body;
 let input = todo_form.children[0];
 let btn = todo_form.children[1];
 input.value = text;
 btn.value = "Change";
 todo_form.setAttribute("data-id", id);
 todo_form.classList.add('show');
}

const deleteTask = (e) => {
 const id = e.target.parentNode.parentNode.dataset.id;
 tasks.splice(id, 1);
 
 localStorage.setItem('tasks', JSON.stringify(tasks));
 renderTasks();
}

const toggleTask = (e) => {
 let found = e.target;
 let index = found.parentNode.dataset.id;
 
 if(!found) { return }

 tasks[index].completed = found.checked;
 
 localStorage.setItem('tasks', JSON.stringify(tasks));
 renderTasks();
}

const dom_manipulations = (tasks, todo_list) => {
 let non_empty_count = 0;
 tasks.forEach(task => {
  if(task !== "empty") non_empty_count++ ;
 });

 if(non_empty_count === 0) {
  body = document.createElement('div');
  body.classList.add("centered");
  body.textContent = "Empty List";
  todo_list.appendChild(body);
  return
 }
 tasks.forEach((task, i) => {
  
  if(task !== "empty") {
   list_item = document.createElement('li');
   list_item.setAttribute("data-id", i);

   check = document.createElement('INPUT');
   check.setAttribute("type", "checkbox");
   check.setAttribute("name", i);
   check.checked = task.completed;
   check.addEventListener('change', toggleTask);

   body = document.createElement('label');
   body.setAttribute('for', i);
   body.textContent=task.body;
   more = document.createElement("div");
   more.className = "todo__content-list-more"

   editIcon = document.createElement("i");
   editIcon.className = "fa fa-pencil";
   editIcon.addEventListener("click", changeTask);

   deleteIcon = document.createElement("i");
   deleteIcon.className = "fa fa-trash";
   deleteIcon.addEventListener("click", deleteTask);
   
   more.appendChild(editIcon);
   more.appendChild(deleteIcon);
  
   list_item.appendChild(check);
   list_item.appendChild(body);
   list_item.appendChild(more);

   todo_list.appendChild(list_item);
  }
 });
}

const renderTasks = () => {
 tasks = JSON.parse(localStorage.getItem('tasks')) || [];

 let completed_tasks = 0;

 tasks.forEach(task => {
  if(task.completed) {
   completed_tasks += 1;
  }
 });

 document.querySelector(".todo__header-banner-completed").innerHTML = completed_tasks;
 document.querySelector(".todo__header-banner-all").innerHTML = `/ ${tasks.length}`;


 let todo_list = todo_container.querySelector(".todo__content-list.all");
 todo_list.replaceChildren();
 dom_manipulations(tasks, todo_list);
 
 
 let filtered_tasks = []
 tasks.forEach(task => {
  // For finished tasks
  if(task.completed) {
   filtered_tasks.push(task);
  }
  else {
   filtered_tasks.push("empty");
  }
 });
 todo_list = todo_container.querySelector(".todo__content-list.completed");
 todo_list.replaceChildren();
 dom_manipulations(filtered_tasks, todo_list);

 // for unfinished tasks
 filtered_tasks = []
 tasks.forEach(task => {
  if(!task.completed) {
   filtered_tasks.push(task);
  }
  else {
   filtered_tasks.push("empty");
  }
 });
 todo_list = todo_container.querySelector(".todo__content-list.uncompleted");
 todo_list.replaceChildren();
 dom_manipulations(filtered_tasks, todo_list);
 
}

const showForm = () => {
 todo_form.children[0].value = "";
 todo_form.children[1].value = "Add";
 todo_form.classList.toggle('show');
}

const displayList = (e) => {
 filter = e.target.className.split(" ")[1];

 

 todo_btns.forEach(btn => {
  let classname = btn.className.split(" ")[1];
  if(classname !== filter && btn.className.includes("active")) {
   btn.classList.remove("active");
   content = todo_container.querySelector(`.${classname}`).parentNode;
   content.classList.remove("active");
  }
  if(classname === filter) {
   btn.classList.add("active");
   content = todo_container.querySelector(`.${filter}`).parentNode;
   content.classList.add("active");
  }
 }
 );
}

todo_btns.forEach(btn => {
 filter = btn.className.split(" ")[1];

 if(filter !== "add") {
  btn.addEventListener("click", (e) => {
  renderTasks();
  displayList(e);
 })
 }
});
renderTasks();
todo_add.addEventListener("click", showForm);
todo_form.addEventListener("submit", addTask);
form_exit.addEventListener("click", () => {todo_form.classList.remove("show");});
