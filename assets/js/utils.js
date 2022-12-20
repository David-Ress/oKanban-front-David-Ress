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

    //Ecouteur d'évênement sur une liste pour montrer le champs pour changer le nom:
    const editListButtonElmtsList= document.querySelectorAll('.edit-list--button');
    for (const editListButtonElmt of editListButtonElmtsList) {
      editListButtonElmt.addEventListener('click', listModule.showEditListModal);
    }
    
    //Ecouteur d'évênement sur une liste pour gérer le PATCH:

    const showEditField = document.querySelectorAll(".modify-name");
    for (const field of showEditField) {
      field.addEventListener('submit',listModule.handleEditListForm)
    }

    //Ecouteur d'évênement sur une card pour montrer le champs pour changer le nom:
    const editListCardElmtsList= document.querySelectorAll('.edit-card--button');
    for (const editCardButtonElmt of editListCardElmtsList) {
      editCardButtonElmt.addEventListener('click', cardModule.showEditCardModal);
    }
    
    //Ecouteur d'évênement sur le form pour changer le contenu:
    const editCardForm = document.querySelectorAll('.modify-card-name');
    for (const form of editCardForm) {
      form.addEventListener('submit', cardModule.handleEditCardForm)
    }

    //Ecouteur d'évênement sur le form pour supprimer une carte
    const deleteCardButtons = document.querySelectorAll('.remove-card-button')

  },

  hideModals() {
    // Pour faire disparaitre une modale, il suffit de supprimer sa classe "is-active"
    const allModalsElmtList = document.querySelectorAll('.modal');

    for(const modalElmt of allModalsElmtList) {
      modalElmt.classList.remove('is-active');
    }
  },
}
