let carosellos = [];

const render = () => {
    const caroselloList = document.getElementById('caroselloList');
    caroselloList.innerHTML = ''; 
  
carosellos.forEach((carosello, index) => 
  caroselloList.innerHTML += 
    "<li class='carosello-item " + (carosello.completed ? 'completed-box' : '') + "'>" +
      "<span class='task-name'>" + carosello.name + "</span>" +
      "<button class='complete-btn'>Complete</button>" +
      "<button class='delete-btn'>Delete</button>" +
    "</li>"
    );

  
    
    const completeButtons = document.querySelectorAll('.complete-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
  
    
    completeButtons.forEach((button, index) => {
      button.onclick = () => {
        carosellos[index].completed = !carosellos[index].completed; 
        completeCarosello(carosellos[index]).then(() => render()); 
      };
    });
  
    
    deleteButtons.forEach((button, index) => {
      button.onclick = () => {
        deleteCarosello(carosellos[index].id).then(() => {
          carosellos.splice(index, 1); 
          render(); 
        });
      };
    });
};
  

const send = (carosello) => {
  return new Promise((resolve, reject) => {
    fetch("/carosello/add", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(carosello)
    })
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};

const load = () => {
  return new Promise((resolve, reject) => {
    fetch("/carosello")
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};


const errorMessage = document.getElementById('error-message');

insertButton.onclick = () => {
    const caroselloName = caroselloInput.value.trim();

    if (caroselloName === '') {
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    const carosello = {          
        name: caroselloName,
        completed: false
    };      

    send({carosello: carosello})
        .then(() => load())
        .then((json) => { 
            carosellos = json.carosellos;
            caroselloInput.value = "";
            render(); 
        });
};

load().then((json) => {

  carosellos = json.carosellos;
 
    render();
 
 });
 

const completeCarosello = (carosello) => {
  return new Promise((resolve, reject) => {
    fetch("/carosello/complete", {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(carosello)
    })
    .then((response) => response.json())
    .then((json) => {
      resolve(json);
    });
  });
};

const deleteCarosello = (id) => {
  return new Promise((resolve, reject) => {
    fetch("/carosello/" + id, {
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
    carosellos = json.carosellos;
    caroselloInput.value = "";
    render();
  });
}, 30000);


(async () => {
  const inputFile = document.querySelector('#file'); // c'è
  const button = document.querySelector("#insertButton"); // c'è
  const link = document.querySelector("#link"); //c'è
  const fileListContainer = document.querySelector("#caroselloList"); // c'è

  const loadFileList = async () => {
    const res = await fetch("/filelist");
    const files= await res.json();
    fileListContainer.innerHTML = files.map(fileUrl => `<li><a href="${fileUrl}" target="_blank">${fileUrl}</a></li>`).join('');
  }

  const handleSubmit = async (event) => {
    const formData = new FormData();
    formData.append("file", inputFile.files[0]);
    const body = formData;
    body.description = inputFile.value;
    const fetchOptions = {
      method: 'post',
      body: body
    };
    try {
      const res = fetch("/upload", fetchOptions);
      const data = res.json();      
      link.href = data.url;
      loadFileList();
    } catch (e) {
      console.log(e);
    }
  }

  button.onclick = handleSubmit;
  loadFileList();
})();