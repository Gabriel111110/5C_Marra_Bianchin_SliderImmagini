let carosellos = [{id:1, url:"./files/1real.png"}, {id:2, url:"./files/erroreSintassiDelete.png"}];

function render() {
  load().then((json) => {
    console.log(json);
    carosellos = json.carosello;

    let html = `<div id="carouselExampleSlidesOnly" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner">`;
    carosellos.forEach((element, index) => { // non mette active le altre immagini del carosello quindi non va il previous/next nè fa vedere tutte le immagini in admin
      html += `<div class="carousel-item ` + (index == 0 ? "active" : "") + `"> 
      <img class="d-block w-100" src="`+ element.url + `" alt="First slide">
    </div>`;
    });
    html += "</div> </div>";
    document.querySelector("#caroselloList").innerHTML = html;
    document.querySelector("#crs").innerHTML += html;

  });

}



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

  send({ carosello: carosello })
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
    //caroselloInput.value = "";
    render();
  });
}, 30000);


(async () => {
  const inputFile = document.querySelector('#file'); // c'è
  const button = document.querySelector("#insertButton"); // c'è
  const link = document.querySelector("#link"); //c'è
  const fileListContainer = document.querySelector("#caroselloList"); // c'è

  const loadFileList = async () => {
    const res = await fetch("/carosello");
    const files = await res.json();
    render()
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
      fetch("/carosello/add", fetchOptions).then(res=>res.json()).then(data=>{console.log(data);
      link.href = data.url;
      loadFileList();
    })
      
      
      
    } catch (e) {
      console.log(e);
    }
  }

  button.onclick = handleSubmit;
  loadFileList();
})();