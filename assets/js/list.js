const listModule = {
  showAddListModal() {
    // On récupère la div de la modale
    const modaleDivElmt = document.getElementById('addListModal');

    // On ajoute la classe is-active
    modaleDivElmt.classList.add('is-active');
    
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

   // Pour créer une liste dans le DOM on aura forcément besoin de son titre
  makeListInDOM(listObject) {
    // On récupère notre template de liste
    const listTemplateElmt = document.getElementById('list-template');
    
    // On crée un exemplaire de liste en clonant le contenu du template avec la méthode importNode
    const newListElmt = document.importNode(listTemplateElmt.content, true);

    // On modifie le titre pour le remplacer par le vrai nom de la liste qu'on est en train de créer
    const listTitleElmt = newListElmt.querySelector('h2');
    listTitleElmt.textContent = listObject.name;

    // On va également générer un ID unique à partir de la date à laquelle on crée l'élément
    newListElmt.querySelector('[data-list-id]').dataset.listId = listObject.id;

    // On en profite également au passage pour ajouter l'écouteur d'événement qui affiche la modale de création de carte
    // sur le bouton
    const addCardButtonElmt = newListElmt.querySelector('.add-card--button');
    addCardButtonElmt.addEventListener('click', cardModule.showAddCardModal);

    const editListButtonElmtsList= newListElmt.querySelector('.edit-card--button');
    editListButtonElmtsList.addEventListener('click', listModule.showEditListModal);

        //Ecouteur d'évênement sur une liste pour gérer le PATCH:

    const showEditField = document.querySelectorAll(".modify-name");
    for (const field of showEditField) {
      field.addEventListener('submit',listModule.handleEditListForm)
    }

    
    // On l'insère dans le DOM dans le container qui contient les listes de taches
    const listContainer = document.querySelector('#lists-container');
    listContainer.appendChild(newListElmt);
    // On pouvait aussi choisir d'insérer la liste en premier enfant du container (pour l'avoir au début)
    // listContainer.prepend(newListElmt);
    
  },

  showEditListModal(event){
    const clickedButton = event.target;

    const parentListElmt = clickedButton.closest('[data-list-id]');

    const showEditField = parentListElmt.querySelector(".modify-name");

    const title = parentListElmt.querySelector("h2")
    
    showEditField.classList.toggle("is-hidden");
    title.classList.toggle("is-hidden");
  },

  async handleEditListForm(event){
    event.preventDefault();
    // - Récupérer la liste à éditer : OK
    // - Faire un fetch avec patch, appeler l'API
    // - si pas ok: renvoyer erreur et afficher titre sans modifier
    // - si ok: renvoyer succès, modifier h2 et réafficher
    // - On remasque le formulaire.

    // La bonne liste à éditer:
    const formElmt = event.target;

    const parentListElmt = formElmt.closest('[data-list-id]');

    

    const listId = parentListElmt.dataset.listId;

    console.log(listId)

    const formDataInstance = new FormData(formElmt);

    try {
      // On va utiliser un fetch avec cette fois la méthode PATCH
      const response = await fetch(`${utilsModule.base_url}/lists/${listId}`, {
        method: 'PATCH',
        body: formDataInstance
      });

      if(response.ok) {
        const newTitle = formDataInstance.getAll('name');
        const title = parentListElmt.querySelector("h2");
        title.classList.remove("is-hidden");
        title.innerText = newTitle
      }



    } catch (error) {
      alert(`Impossible de créer la liste depuis l'API. Statut: ${error}`);
    }

    
    const showEditField = parentListElmt.querySelector(".modify-name");
    // const title = parentListElmt.querySelector("h2");
    showEditField.classList.add("is-hidden");
    // title.classList.toggle("is-hidden");
   
    

  },

};