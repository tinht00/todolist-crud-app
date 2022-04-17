const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const taskInput = $(".task-input input");
const taskList = $(".task-list");
const filters = $$('.filters span');

// const btnAdd = $('.btn.add-btn');
// getting localStorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

window.onload = () => {
  taskInput.value = "";
};
filters.forEach((filter) => {
   filter.onclick = () => {
      $('span.active').classList.remove('active')
      filter.classList.add('active');
      showTodoList(filter.id);
   }
});

$('.btn.clear-btn').onclick = () =>{
   todos.splice(0,todos.length)
   showTodoList('all');
   localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskInput.onkeyup = (e) => {
  let taskValue = taskInput.value.trim();
  if (e.key == "Enter" && taskValue) {
    if (taskValue.indexOf("\\") >= 0) {
       alert('Có chứa kí tự "\\" không hợp lệ !!!')
    }else{
      if (!isEditedTask) {
         if (!todos) {
           todos = [];
         }
         let taskInfo = {
           taskName: taskValue,
           status: "pending",
         };
         todos.push(taskInfo); // add
       } else {
         isEditedTask = false;
         todos[editId].taskName = taskValue;
       }
 
    }

    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList('all');
  }
};

function showTodoList(filter) {
  let taskHtml = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed, set the isCompleted value to checked
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == 'all') {
         
         taskHtml += `<li class="task">
            <label for="${id}">
              <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}/>
              <p class="${isCompleted}">${todo.taskName}</p>
            </label> 
            <div class="settings">
              <i class="uil uil-ellipsis-h"></i>
              <ul class="options-menu">
                <li onclick="editTask(${id},'${todo.taskName}')" class="option"><i class="uil uil-edit-alt">&nbsp Edit</i></li>
                <li onclick="deleteTask(${id})" class="option">
                  <i  class="uil uil-trash-alt">&nbsp Delete</i>
                </li>
              </ul>
            </div>
          </li>`;
      }
    });
  }
  taskList.innerHTML = taskHtml
    ? taskHtml
    : `<i style="color:#5a5a5a">You don't have any task here !!!</i>`;
}
showTodoList('all');

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
let editId;
let isEditedTask = false;
function editTask(taskId, taskName) {
  editId = taskId;
  isEditedTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  localStorage.setItem("todo-list", JSON.stringify(todos));
}
function deleteTask(deleteId) {
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodoList('all');
}
