let todos = [];

const render = () => {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = ''; 
  
 todos.forEach((todo, index) => 
  todoList.innerHTML += 
    "<li class='todo-item " + (todo.completed ? 'completed-box' : '') + "'>" +
      "<span class='task-name'>" + todo.name + "</span>" +
      "<button class='complete-btn'>Complete</button>" +
      "<button class='delete-btn'>Delete</button>" +
    "</li>"
    );

  
    
    const completeButtons = document.querySelectorAll('.complete-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
  
    
    completeButtons.forEach((button, index) => {
      button.onclick = () => {
        todos[index].completed = !todos[index].completed; 
        completeTodo(todos[index]).then(() => render()); 
      };
    });
  
    
    deleteButtons.forEach((button, index) => {
      button.onclick = () => {
        deleteTodo(todos[index].id).then(() => {
          todos.splice(index, 1); 
          render(); 
        });
      };
    });
};
  

const send = (todo) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/add", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    })
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};

const load = () => {
  return new Promise((resolve, reject) => {
    fetch("/todo")
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};


const errorMessage = document.getElementById('error-message');

insertButton.onclick = () => {
    const todoName = todoInput.value.trim();

    if (todoName === '') {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    const todo = {          
        name: todoName,
        completed: false
    };      

    send({todo: todo})
        .then(() => load())
        .then((json) => { 
            todos = json.todos;
            todoInput.value = "";
            render(); 
        });
};

load().then((json) => {

    todos = json.todos;
 
    render();
 
 });
 

const completeTodo = (todo) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/complete", {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    })
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};

const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    fetch("/todo/" + id, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};

setInterval(() => {
  load().then((json) => {
    todos = json.todos;
    todoInput.value = "";
    render();
  });
}, 30000);

