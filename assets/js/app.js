
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

    // On récupère la valeur du champ list-name dans une variable
    const listNameValue = formDataInstance.get(('list-name'));

    // On déclenche la création / insertion de la liste dans le DOM à partir du nom récupéré depuis le form
    app.makeListInDOM(listNameValue);

    // On peut également choisir de "nettoyer" le champ du form avant de fermer la modale
    // On utilise ici un sélecteur CSS qui permet de cibler l'input qui possède un attribut name égal à "list-name"
    const listNameInputElmt = formElmt.querySelector('input[name="list-name"]');
    listNameInputElmt.value = '';

    // On oublie pas de fermer toutes les modales quand la liste est créée
    app.hideModals();
  },

  // Pour créer une liste dans le DOM on aura forcément besoin de son titre
  makeListInDOM(listName) {
    // On récupère notre template de liste
    const listTemplateElmt = document.getElementById('list-template');
    
    // On crée un exemplaire de liste en clonant le contenu du template avec la méthode importNode
    const newListElmt = document.importNode(listTemplateElmt.content, true);

    // On modifie le titre pour le remplacer par le vrai nom de la liste qu'on est en train de créer
    const listTitleElmt = newListElmt.querySelector('h2');
    listTitleElmt.textContent = listName;

    // On l'insère dans le DOM dans le container qui contient les listes de taches
    const listContainer = document.querySelector('#lists-container');
    listContainer.appendChild(newListElmt);
    // On pouvait aussi choisir d'insérer la liste en premier enfant du container (pour l'avoir au début)
    // listContainer.prepend(newListElmt);
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );