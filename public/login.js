export function login(parentElement, pubsub) {

  const myToken = "c6664b7e-16c5-4a74-931e-377b271f30b2"; //token per salvataggio

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
          "key": myToken
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

}
