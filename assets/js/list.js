const listModule = {
  showAddListModal() {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById('addListModal');

    // On ajoute la classe is-active
    modaleDivElmt.classList.add('is-active');
  },

  showEditTitleForm(event) {
    // On cache l'ancien titre sur lequel on a double cliqué
    const titleElmt = event.target;
    titleElmt.classList.add('is-hidden');
    // On affiche le formulaire
      // On cible le formulaire à partir du titre
      // 2 solutions:
        // Solution 1: On remonte sur la liste parente pour redescendre ensuite sur le form
        const parentListElmt = titleElmt.closest('[data-list-id]');
        const formElmt = parentListElmt.querySelector('form');
        
        // Solution 2: On peut également utiliser la propriété nextElementSibling 
        // ATTENTION: cette solution est plus dangereuse si jamais on modifie la position du form par la suite
        // const formElmt = titleElmt.nextElementSibling

    // On peut ensuite afficher le form en supprimer sa classe "is-hidden"
    formElmt.classList.remove('is-hidden');
  },

  async handleAddListForm(event) {
    event.preventDefault();

    // On récupère le formulaire dans une variable à partir de l'event
    const formElmt = event.target;

    // On génère une instance de formData
    const formDataInstance = new FormData(formElmt);

    // Attention: par défaut l'instance d'un formData n'affiche pas les propriété qu'elle contient dans une console.log (car elles sont privées)
    // console.log(formDataInstance);

    // On va contacter l'API pour que la liste soit enregistrée en DB
    try {
      // On va utiliser un fetch avec cette fois la méthode POST
      const response = await fetch(`${utilsModule.base_url}/lists`, {
        method: 'POST',
        body: formDataInstance
      });

      if(!response.ok) {
        throw new Error(response.status);
      }

      // on récupère la liste qui a été créée renvoyée par l'API
      const createdList = await response.json()

      // On insère cette liste dans le DOM avec notre méthode
      listModule.makeListInDOM(createdList);

    } catch (error) {
      alert(`Impossible de créer la liste depuis l'API. Statut: ${error}`);
    }


    // // On déclenche la création / insertion de la liste dans le DOM à partir du nom récupéré depuis le form

    // On peut également choisir de "nettoyer" le champ du form avant de fermer la modale
    // On utilise ici un sélecteur CSS qui permet de cibler l'input qui possède un attribut name égal à "list-name"
    const listNameInputElmt = formElmt.querySelector('input[name="name"]');
    listNameInputElmt.value = '';

    // On oublie pas de fermer toutes les modales quand la liste est créée
    utilsModule.hideModals();
  },

  async handleEditTitleFormSubmit(event) {
    // On neutralise le comportement par défaut du form
    event.preventDefault();

    // On récupère le form depuis l'event
    const editFormElmt = event.target;
    
    // On récupère la data du form en générant une instance de formData
    const data = new FormData(editFormElmt);

    // On extrait l'id de la liste depuis le formData qu'on va pouvoir passer dans notre url de fetch
    const listId = data.get('list-id');

    // On doit du coup à nouveau cibler notre titre à partir du form sur lequel s'est produit l'événement
    // Comme tout à l'heure: on remonte sur la liste parente
    const parentList = editFormElmt.closest('[data-list-id]');
    // Et on redescend ensuite sur le titre
    const titleElmt = parentList.querySelector('h2');
    
    try {
      // On envoie la data à notre API pour que la modif soit enregistrée en DB
      const response = await fetch(`${utilsModule.base_url}/lists/${listId}`, {
        method: 'PATCH',
        body: data
      });

      // On vérifie la réponse de l'API
      if(response.status !== 200) {
        throw new Error(`Impossible d'éditer le nom de cette liste. Statut: ${response.status}`)
      }

      // Si l'API a répondu avec un statut 200 
        // Alors on modifie le titre dans notre DOM avec sa nouvelle valeur
      const newTitleValue = data.get('name');

      titleElmt.textContent = newTitleValue;

        // On réaffiche le titre
      titleElmt.classList.remove('is-hidden');
      
        // On masque le formulaire
      editFormElmt.classList.add('is-hidden');
      
    } catch (error) {
      // Sinon, s'il y a une erreur coté API
      // On l'affiche dans une alerte à l'utilistateur
      alert(error);
      
      // On réaffiche l'ancien titre sans le modifier
      titleElmt.classList.remove('is-hidden');

      // et on masque le form
      editFormElmt.classList.add('is-hidden');
    }
  },

  async handleDeleteList(event) {
    event.preventDefault();

    // on demande confirmatipon à l'utilisateur
    if(!confirm("Etes-vous sur de vouloir supprimer cette liste ?")) {
      // si il refuse, on arrete tout avec un return
      return;
    }

    // On cible la carte à supprimer en remontant à partir du bouton cliqué
    const deleteButtonElmt = event.target;
    const listElmt = deleteButtonElmt.closest('[data-list-id]');

    const listId = listElmt.dataset.listId;

    try {
      // On envoie la requete à la DB avec un fetch pour faire la suppression
      const response = await fetch(`${utilsModule.base_url}/lists/${listId}`, {
        method: 'DELETE'
      });

      if(response.status !== 204) {
        throw new Error(`Impossible de supprimer cette liste. Statut: ${response.status}`);
      };

      // Si la suppression se passe bien:
      // On supprime immédiatement la carte du DOM avec la méthode remove
      listElmt.remove();
    } catch (error) {
      alert(error);
    }
  },



   // Pour créer une liste dans le DOM on aura forcément besoin de son titre
  makeListInDOM(listObject) {
    // On récupère notre template de liste
    const listTemplateElmt = document.getElementById('list-template');
    
    // On crée un exemplaire de liste en clonant le contenu du template avec la méthode importNode
    const newListElmt = document.importNode(listTemplateElmt.content, true);

    // On modifie le titre pour le remplacer par le vrai nom de la liste qu'on est en train de créer
    const listTitleElmt = newListElmt.querySelector('h2');
    listTitleElmt.textContent = listObject.name;

    const editButtonElement = newListElmt.querySelector('.edit-list-button');

    // On en profite également pour brancher l'écouteur du double clique sur le titre
    editButtonElement.addEventListener('click', listModule.showEditTitleForm);
    // Et aussi l'écouteur du submit sur le form (qui est caché par défaut à la création
    // mais sur lequel on a quand meme déjà la possibilité d'agir coté JS)
    const hiddenForm = newListElmt.querySelector('form');
    hiddenForm.addEventListener('submit', listModule.handleEditTitleFormSubmit);
    // Et on en profite pour mettre à jour l'input caché "list_id" avec la bonne valeur
    hiddenForm.querySelector('[name="list-id"]').value = listObject.id;

    // On va également générer un ID unique à partir de la date à laquelle on crée l'élément
    newListElmt.querySelector('[data-list-id]').dataset.listId = listObject.id;

    // On en profite également au passage pour ajouter l'écouteur d'événement qui affiche la modale de création de carte
    // sur le bouton
    const addCardButtonElmt = newListElmt.querySelector('.add-card--button');
    addCardButtonElmt.addEventListener('click', cardModule.showAddCardModal);

    const deleteCardButtonElmt = newListElmt.querySelector('.delete-list-button');
    deleteCardButtonElmt.addEventListener('click', listModule.handleDeleteList);

    const cardsContainerElmt = newListElmt.querySelector('.cards-container');
    Sortable.create(cardsContainerElmt);

    // On l'insère dans le DOM dans le container qui contient les listes de taches
    const listContainer = document.querySelector('#lists-container');
    listContainer.appendChild(newListElmt);
    // On pouvait aussi choisir d'insérer la liste en premier enfant du container (pour l'avoir au début)
    // listContainer.prepend(newListElmt);

    
  },

  async updateAllListPositions(){
    const listsElmtsArray = document.querySelectorAll('[data-list-id]');

    listsElmtsArray.forEach(async (listElemt, listElemtIndex) => {
      const data = new FormData();
      const listId = listElemt.dataset.listId;
      data.set('position', listElemtIndex )
      try{
        const response = await fetch (`${utilsModule.base_url}/lists/${listId}`, {
          method: 'PATCH',
          body: data
        })

        if(response.status!==200){
          throw new Error(`Impossible d'éditer la position de la liste possédant l'id ${listId}. Statut: ${response.status}`);
        }
        
      } catch(error){
        alert(error);
      }
    })

    
  }
}