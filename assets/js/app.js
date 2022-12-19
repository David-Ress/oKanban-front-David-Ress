
// on objet qui contient des fonctions
const app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    app.addListenerToActions();
    
    console.log('app.init !');
  },
  
  addListenerToActions() {
    // On récupère le bouton d'ouverture de la modale
    const addListBtnElmt = document.getElementById('addListButton');
    
    // On ajoute l'écouteur sur le clique
    addListBtnElmt.addEventListener('click', app.showAddListModal);

    // On ajoute également les écouteurs pour les boutons qui ferment la modale
    const modalCloseButtonElmtList = document.querySelectorAll('.close');
    // On oublie pas que querySelectroAll renvoie un tableau d'éléments, et qu'il faut donc boucler dessus
    for(const closeButtonElmt of modalCloseButtonElmtList) {
      closeButtonElmt.addEventListener('click', app.hideModals);
    }

    // On pourrait aussi faire la meme chose avec un foreach directement
    // modalCloseButtonElmtList.forEach((closeButtonElmt) => closeButtonElmt.addEventListener('click', app.hideModals));
    
    // On ajoute l'écouteur sur le form de la modale pour intercepter le submit
    const addListFormElmt = document.querySelector('#addListModal form');

    addListFormElmt.addEventListener('submit', app.handleAddListForm);
  },

  showAddListModal() {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById('addListModal');

    // On ajoute la classe is-active
    modaleDivElmt.classList.add('is-active');
  },

  hideModals() {
    // Pour faire disparaitre une modale, il suffit de supprimer sa classe "is-active"
    const allModalsElmtList = document.querySelectorAll('.modal');

    for(const modalElmt of allModalsElmtList) {
      modalElmt.classList.remove('is-active');
    }
  },

  handleAddListForm(event) {
    event.preventDefault();

    // On récupère le formulaire dans une variable à partir de l'event
    const formElmt = event.target;

    // On génère une instance de formData
    const formDataInstance = new FormData(formElmt);

    // Attention: par défaut l'instance d'un formData n'affiche pas les propriété qu'elle contient dans une console.log (car elles sont privées)
    // console.log(formDataInstance);

    // pour accéder aux valeurs des champs, on doit utiliser un getter auquel on passe le nom du champ dont on veut récupérer la valeur
    console.log('Valeur du champ "list-name":', formDataInstance.get('list-name'));

    console.log('ici je prends en charge le submit du formulaire de création de liste');
  },

  makeListInDOM() {
    console.log('ici on crée une liste dans le DOM')
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );