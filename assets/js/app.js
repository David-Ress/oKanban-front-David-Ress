
// on objet qui contient des fonctions
const app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.getListsFromAPI();

    app.addListenerToActions();
    
    console.log('app.init !');
  },

  addListenerToActions() {
    // On récupère le bouton d'ouverture de la modale
    const addListBtnElmt = document.getElementById('addListButton');
    
    // On ajoute l'écouteur sur le clique
    addListBtnElmt.addEventListener('click', listModule.showAddListModal);

    // On ajoute également les écouteurs pour les boutons qui ferment la modale
    const modalCloseButtonElmtList = document.querySelectorAll('.close');
    // On oublie pas que querySelectroAll renvoie un tableau d'éléments, et qu'il faut donc boucler dessus
    for(const closeButtonElmt of modalCloseButtonElmtList) {
      closeButtonElmt.addEventListener('click', utilsModule.hideModals);
    }
    
    // On pourrait aussi faire la meme chose avec un foreach directement
    // modalCloseButtonElmtList.forEach((closeButtonElmt) => closeButtonElmt.addEventListener('click', utilsModule.hideModals));
    
    // On ajoute l'écouteur sur le form de la modale pour intercepter le submit de création de liste
    const addListFormElmt = document.querySelector('#addListModal form');
    // On gère le submit du form d'ajout de liste
    addListFormElmt.addEventListener('submit', listModule.handleAddListForm);

    // On ajoute l'écouteur sur les bouton d'ajout de carte
    const addCardButtonElmtsList = document.querySelectorAll('.add-card--button');

    for (const addCardButtonElmt of addCardButtonElmtsList) {
      addCardButtonElmt.addEventListener('click', cardModule.showAddCardModal);
    }

    // On ajoute l'écouteur sur le form de la modale pour intercepter le submit de la création de carte
    const addCardFormElmt = document.querySelector('#addCardModal form');
    // On gère le submit du form d'ajout de liste
    addCardFormElmt.addEventListener('submit', cardModule.handleAddCardForm);

    const titlesList = document.querySelectorAll('.list-title');

    console.log(titlesList);
  },

  async getListsFromAPI() {

    try {
      const response = await fetch(`${utilsModule.base_url}/lists`);

      if(!response.ok) {
        throw new Error(response.status);
      }

      const listsArray = await response.json();

      for(const listObject of listsArray) {
        // Pour chaque liste de mon tableau, j'appelle la fonction makeListInDOM
        listModule.makeListInDOM(listObject);

        // On boucle également pour chaque liste sur les card pour les générer
        for(const cardObject of listObject.cards) {
          cardModule.makeCardInDOM(cardObject);
        }
      }
      
    } catch (error) {
      alert(`Impossible de récupérer les listes depuis l'API. Statut: ${error}`);
    }
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init);
