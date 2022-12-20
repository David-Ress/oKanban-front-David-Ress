
// on objet qui contient des fonctions
const app = {
  
  // fonction d'initialisation, lancée au chargement de la page
  init: function () {
    utilsModule.addListenerToActions();

    app.getListsFromAPI();
    
    console.log('app.init !');
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
