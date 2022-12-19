
// on objet qui contient des fonctions
const app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.addListenerToActions();
    
    console.log('app.init !');
  },
  
  addListenerToActions() {
    // On récupère le bouton
    const addListBtnElmt = document.getElementById("addListButton");
    
    // On ajoute l'écouteur sur le cl
    addListBtnElmt.addEventListener('click', app.showAddListModal);
  },

  showAddListModal() {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById("addListModal");

    // On ajoute la classe is-active
    modaleDivElmt.classList.add('is-active');
  }
  
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );