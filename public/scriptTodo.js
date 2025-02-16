
export function scriptTodo(parentElement, pubsub) {
  let carosellos = [{ id: 1, url: "./files/1real.png" }, { id: 2, url: "./files/erroreSintassiDelete.png" }];
  return {
    setCarosellos: function (c){
      carosellos = c;
    },
    render: function () {
      this.load().then((json) => {
        carosellos = json.carosello;
        carosellos.sort().reverse();
        let html = `<table><tr><th>Immagine</th><th>Azioni</th></tr>`;
        carosellos.forEach((element, index) => {
          html += `<tr>
            <td><img class="d-block w-100" src="`+ element.url + `" alt="First slide">
            <td>
              <button id = "deletebtn">Delete</button>
            </td>
          </tr>`;
        });
        html += "</table>";
        document.querySelector("#caroselloList").innerHTML = html;
      });
    },
    send: function (carosello) {
      return new Promise((resolve, reject) => {
        fetch("/carosello/add", {
          method: 'POST',
          body: carosello
        })
          .then((response) => response.json())
          .then((json) => {
            resolve(json);
          });
      });
    },
    load: function () {
      return new Promise((resolve, reject) => {
        fetch("/carosello")
          .then((response) => response.json())
          .then((json) => {
            pubsub.publish("load", json);
            resolve(json);
          });
      });
    },
    completeCarosello: function (carosello) {
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

    },
    deleteCarosello: function (id) {
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

    }
  }
}