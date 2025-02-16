export function generatePublic(parentElement, pubsub) {
  const vaiAdAdmin = document.querySelector('#goToAdmin');
  const vaiAPublic = document.querySelector('#goToPublic');
  let carosellos;
  return {
    build: function () {
      pubsub.subscribe("load", (data) => {
        carosellos = data.carosello;
        this.render();
      });
    },
    render: function () {
      let html = `<div id="carouselImagesIndicators" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">`;
      carosellos.forEach((element, index) => { // non mette active le altre immagini del carosello quindi non va il previous/next nè fa vedere tutte le immagini in admin
        html += `<div class="carousel-item ` + (index == 0 ? "active" : "") + `"> 
        <img class="d-block w-100" src="`+ element.url + `" alt="First slide">
      </div>`;
      });
      html += "</div> </div>";
      parentElement.innerHTML = html;
    }
  }
}


