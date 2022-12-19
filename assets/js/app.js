
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
    
    // On ajoute l'écouteur sur le form de la modale pour intercepter le submit de création de liste
    const addListFormElmt = document.querySelector('#addListModal form');
    // On gère le submit du form d'ajout de liste
    addListFormElmt.addEventListener('submit', app.handleAddListForm);

    // On ajoute l'écouteur sur les bouton d'ajout de carte
    const addCardButtonElmtsList = document.querySelectorAll('.add-card--button');

    for (const addCardButtonElmt of addCardButtonElmtsList) {
      addCardButtonElmt.addEventListener('click', app.showAddCardModal);
    }

    // On ajoute l'écouteur sur le form de la modale pour intercepter le submit de la création de carte
    const addCardFormElmt = document.querySelector('#addCardModal form');
    // On gère le submit du form d'ajout de liste
    addCardFormElmt.addEventListener('submit', app.handleAddCardForm);


  },

  showAddListModal() {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById('addListModal');

    // On ajoute la classe is-active
    modaleDivElmt.classList.add('is-active');
  },

  showAddCardModal(event) {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById('addCardModal');

    // On récupère le bouton sur lequel on a cliqué à partir de l'event
    const clickedButtonElmt = event.target
    
    // On remonte ensuite vers son plus proche parent qui possède l'attribut "data-list-id"
    // en utilisant la méthode closest
    const parentListElmt = clickedButtonElmt.closest('[data-list-id]');
    
    // On récupère également l'input caché de notre formulaire dans la modale de création de carte
    const hiddenInputElmt = document.querySelector('[name="list_id"]');
    // On met à jour la valeur de cet input avec l'id de la liste récupérée juste avant
    hiddenInputElmt.value = parentListElmt.dataset.listId;

    // Une fois les données à jour, on ajoute la classe is-active pour afficher la modale
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

  handleAddCardForm(event) {
    event.preventDefault();

    // On récupère le formulaire dans une variable à partir de l'event
    const formElmt = event.target;

    // On génère une instance de formData
    const formDataInstance = new FormData(formElmt);

    // Attention: par défaut l'instance d'un formData n'affiche pas les propriété qu'elle contient dans une console.log (car elles sont privées)
    // console.log(formDataInstance);

    // On récupère la valeur du champ card-description
    const cardDescriptionValue = formDataInstance.get('card-description');
    // Ainsi que l'id de la liste cible
    const listId = formDataInstance.get('list_id');

    // On déclenche la création / insertion de la liste dans le DOM à partir du nom récupéré depuis le form
    app.makeCardInDOM(cardDescriptionValue, listId);

    // On peut également choisir de "nettoyer" le champ du form avant de fermer la modale
    // On utilise ici un sélecteur CSS qui permet de cibler l'input qui possède un attribut name égal à "list-name"
    const cardDescriptionInputElmt = formElmt.querySelector('input[name="card-description"]');
    cardDescriptionInputElmt.value = '';

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

    // On va également générer un ID unique à partir de la date à laquelle on crée l'élément
    const newId = `list-${Date.now()}`;
    newListElmt.querySelector('[data-list-id]').dataset.listId = newId;

    // On en profite également au passage pour ajouter l'écouteur d'événement qui affiche la modale de création de carte
    // sur le bouton
    const addCardButtonElmt = newListElmt.querySelector('.add-card--button');
    addCardButtonElmt.addEventListener('click', app.showAddCardModal);

    // On l'insère dans le DOM dans le container qui contient les listes de taches
    const listContainer = document.querySelector('#lists-container');
    listContainer.appendChild(newListElmt);
    // On pouvait aussi choisir d'insérer la liste en premier enfant du container (pour l'avoir au début)
    // listContainer.prepend(newListElmt);
  },

  makeCardInDOM(cardDescription, targetListId) {
    // On récupère notre template de card
    const cardTemplateElmt = document.getElementById('card-template');
    
    // On crée un exemplaire de liste en clonant le contenu du template avec la méthode importNode
    const newCardElmt = document.importNode(cardTemplateElmt.content, true);

    // On modifie le titre pour le remplacer par le vrai nom de la liste qu'on est en train de créer
    const cardDescriptionDivElmt = newCardElmt.querySelector('.card-description');
    cardDescriptionDivElmt.textContent = cardDescription;

    // On insère maintenant la carte dans le container de la bonne liste
    const targetListElmt = document.querySelector(`[data-list-id=${targetListId}]`);
    targetListElmt.querySelector('.panel-block').appendChild(newCardElmt);
  }
};


// on accroche un écouteur d'évènement sur le document : quand le chargement est terminé, on lance app.init
document.addEventListener('DOMContentLoaded', app.init );