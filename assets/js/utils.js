const utilsModule = {
  base_url: 'http://localhost:5000',

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


  },

  hideModals() {
    // Pour faire disparaitre une modale, il suffit de supprimer sa classe "is-active"
    const allModalsElmtList = document.querySelectorAll('.modal');

    for(const modalElmt of allModalsElmtList) {
      modalElmt.classList.remove('is-active');
    }
  },
}
