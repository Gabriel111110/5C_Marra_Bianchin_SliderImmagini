export async function login(parentElement, pubsub) {

  fetch("./conf.json").then(r => r.json()).then(config => {

    const inputName = document.querySelector("#username");
    const inputPassword = document.querySelector("#password");
    const loginButton = document.querySelector("#loginButton");

    //funzione per fare la login 
    const login = (name, password) => {
      return new Promise((resolve, reject) => {
        fetch("http://ws.cipiaceinfo.it/credential/login", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "key": config.token
          },
          body: JSON.stringify({
            username: name,
            password: password
          })
        })
          .then(r => r.json())
          .then(r => {
            resolve(r.result);
          })
          .catch(reject);
      })
    }
    loginButton.onclick = () => {
      login(inputName.value, inputPassword.value).then((result) => {
        if (result !== true) {
          window.location.href = "#login";
        } else {
          window.location.href = "#admin";
        }

      })
    }

  })

}
