const cardModule = {
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

  async handleAddCardForm(event) {
    event.preventDefault();

    // On récupère le formulaire dans une variable à partir de l'event
    const formElmt = event.target;

    // On génère une instance de formData
    const formDataInstance = new FormData(formElmt);

    // Attention: par défaut l'instance d'un formData n'affiche pas les propriété qu'elle contient dans une console.log (car elles sont privées)
    // console.log(formDataInstance);

    try {
      // On va utiliser un fetch avec cette fois la méthode POST
      const response = await fetch(`${utilsModule.base_url}/cards`, {
        method: 'POST',
        body: formDataInstance
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      // on récupère la carte qui a été créée renvoyée par l'API
      const createdCard = await response.json();

      // On insère cette carte dans le DOM avec notre méthode
      cardModule.makeCardInDOM(createdCard);

    } catch (error) {
      alert(`Impossible de créer la liste depuis l'API. Statut: ${error}`);
    }

    // On peut également choisir de "nettoyer" le champ du form avant de fermer la modale
    // On utilise ici un sélecteur CSS qui permet de cibler l'input qui possède un attribut name égal à "list-name"
    const cardDescriptionInputElmt = formElmt.querySelector('input[name="content"]');
    cardDescriptionInputElmt.value = '';

    // On oublie pas de fermer toutes les modales quand la liste est créée
    utilsModule.hideModals();
  },

  makeCardInDOM(cardObject) {
    // On récupère notre template de card
    const cardTemplateElmt = document.getElementById('card-template');
    
    // On crée un exemplaire de liste en clonant le contenu du template avec la méthode importNode
    const newCardElmt = document.importNode(cardTemplateElmt.content, true);

    // On modifie le titre pour le remplacer par le vrai nom de la liste qu'on est en train de créer
    const cardDescriptionDivElmt = newCardElmt.querySelector('.card-description');
    cardDescriptionDivElmt.textContent = cardObject.content;

    //Ecouteur d'évênement sur une card pour montrer le champs pour changer le nom:
    const editListCardElmtsList= document.querySelectorAll('.edit-card--button');
    for (const editCardButtonElmt of editListCardElmtsList) {
      editCardButtonElmt.addEventListener('click', cardModule.showEditCardModal);
    };

    const editCardForm = document.querySelectorAll('.modify-card-name');
    for (const form of editCardForm) {
      form.addEventListener('submit', cardModule.handleEditCardForm)
    }

    // On modifie également le dataset de l'id de la carte
    newCardElmt.querySelector('[data-card-id]').dataset.cardId = cardObject.id;

    // On insère maintenant la carte dans le container de la bonne liste
    const targetListElmt = document.querySelector(`[data-list-id="${cardObject.list_id}"]`);
    targetListElmt.querySelector('.panel-block').appendChild(newCardElmt);
  },

  showEditCardModal(event){
    const clickedButton = event.target;

    const parentCardElmt = clickedButton.closest('[data-card-id]');
    console.log(parentCardElmt)

    const showEditField = parentCardElmt.querySelector(".modify-card-name");

    const title = parentCardElmt.querySelector(".card-description");
    
    showEditField.classList.toggle("is-hidden");
    title.classList.toggle("is-hidden");
  },

  async handleEditCardForm(event){
    event.preventDefault();

    const formElmt = event.target;

    const parentCardElmt = formElmt.closest('[data-card-id]');

    

    const cardId = parentCardElmt.dataset.cardId;

    const formDataInstance = new FormData(formElmt);

    try {
      // On va utiliser un fetch avec cette fois la méthode PATCH
      const response = await fetch(`${utilsModule.base_url}/cards/${cardId}`, {
        method: 'PATCH',
        body: formDataInstance
      });

      if(response.ok) {
        const newTitle = formDataInstance.getAll('content');
        const title = parentCardElmt.querySelector(".card-description");
        title.classList.remove("is-hidden");
        title.innerText = newTitle
      }



    } catch (error) {
      alert(`Impossible de créer la liste depuis l'API. Statut: ${error}`);
    }

    
    const showEditField = parentCardElmt.querySelector(".modify-card-name");
    // const title = parentListElmt.querySelector("h2");
    showEditField.classList.add("is-hidden");
    // title.classList.toggle("is-hidden");
   
    

  },

  async handleDeleteCard(event){
    event.preventDefault();

    const formElmt = event.target;

    const parentCardElmt = formElmt.closest('[data-card-id]');

    

    const cardId = parentCardElmt.dataset.cardId;

    const formDataInstance = new FormData(formElmt);

    try {
      // On va utiliser un fetch avec cette fois la méthode PATCH
      const response = await fetch(`${utilsModule.base_url}/cards/${cardId}`, {
        method: 'DELETE',
        body: formDataInstance
      });

      // if(response.ok) {
      //   const newTitle = formDataInstance.getAll('content');
      //   const title = parentCardElmt.querySelector(".card-description");
      //   title.classList.remove("is-hidden");
      //   title.innerText = newTitle
      // }



    } catch (error) {
      alert(`Impossible de créer la liste depuis l'API. Statut: ${error}`);
    }
  },
};
