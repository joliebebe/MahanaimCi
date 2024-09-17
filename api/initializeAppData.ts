// initializeAppData.ts

import axios from 'axios';

const initializeAppData = async () => {
  try {
    await Promise.all([
      fetchPrestationsPro(),
      handleValidation(), // Exemple: Login
      handleRegistration(), // Exemple: Registration
      fetchDetails(),
      fetchData(),
      fetchDetailsProduct(),
      fetchPaymentMethods(),
      fetchDeliveryFee(),
      handleOrderValidation(), // Exemple: Order validation
     // fetchOrderHistory(),
      fetchOrderStatuses(),
      fetchCategories(),
      fetchDataCities(),
      fetchSubCategories(),
    ]);
    console.log('Initial API data loaded successfully');
  } catch (error) {
    console.error('Failed to initialize API data:', error);
    // Gérer les erreurs d'initialisation ici
  }
};

const fetchPrestationsPro = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    const prestationsPro = response.data.resultat.prestations_pro;
    console.log('Fetched Prestations Pro:', prestationsPro);
    // Mettre à jour le state ou effectuer d'autres actions nécessaires
  } catch (error) {
    console.error('Error fetching prestations pro:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const handleValidation = async () => {
  try {
    const response = await axios.post('https://api.mahanaiim.ci/api/auth/login-client', {
      telephone: 'your_telephone_number',
      password_user: 'your_password',
    });
    console.log('Login API Response:', response.data);
    // Mettre à jour le contexte utilisateur ou effectuer d'autres actions nécessaires
  } catch (error) {
    console.error('Error during login:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const handleRegistration = async () => {
  try {
    const response = await axios.post('https://api.mahanaiim.ci/api/client/enregistrer-compte-client', {
      nom: 'user_name',
      prenom: 'user_firstname',
      telephone: 'user_phone',
      email: 'user_email',
      password: 'user_password',
    });
    console.log('Registration API Response:', response.data);
    // Mettre à jour le contexte utilisateur ou effectuer d'autres actions nécessaires
  } catch (error) {
    console.error('Error during registration:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchDetails = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    console.log('Fetch Details API Response:', response.data);
    // Traiter les détails récupérés selon vos besoins
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchData = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    console.log('Fetch Data API Response:', response.data);
    // Traiter les données récupérées selon vos besoins
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchDetailsProduct = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    console.log('Fetch Product Details API Response:', response.data);
    // Traiter les détails du produit récupérés selon vos besoins
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchPaymentMethods = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/configuration/modes-de-paiement');
    console.log('Fetch Payment Methods API Response:', response.data);
    // Traiter les méthodes de paiement récupérées selon vos besoins
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchDeliveryFee = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/configuration/frais-livraison-commande');
    console.log('Fetch Delivery Fee API Response:', response.data);
    // Traiter les frais de livraison récupérés selon vos besoins
  } catch (error) {
    console.error('Error fetching delivery fee:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const handleOrderValidation = async () => {
  try {
    const userToken = 'your_user_token'; // Remplacez par le token d'utilisateur valide
    const orderData = {
      // Définir les données de commande ici
    };
    const response = await axios.post('https://api.mahanaiim.ci/api/commandes/enregistrer-une-commande', orderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    });
    console.log('Order Validation API Response:', response.data);
    // Traiter la réponse de validation de commande selon vos besoins
  } catch (error) {
    console.error('Error during order validation:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

/* const fetchOrderHistory = async () => {
  try {
    const userId = 'user_id'; // Remplacez par l'ID de l'utilisateur actuel
    const response = await axios.get(`https://api.mahanaiim.ci/api/orders/user/${userId}`);
    console.log('Fetch Order History API Response:', response.data);
    // Mettre à jour l'historique des commandes dans le state ou effectuer d'autres actions nécessaires
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
}; */

const fetchOrderStatuses = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/configuration/liste-etat-commande');
    console.log('Fetch Order Statuses API Response:', response.data);
    // Traiter les statuts de commande récupérés selon vos besoins
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    console.log('Fetch Categories API Response:', response.data);
    // Traiter les catégories récupérées selon vos besoins
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchDataCities = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-villes');
    console.log('Fetch Cities API Response:', response.data);
    // Traiter les détails des villes récupérées selon vos besoins
  } catch (error) {
    console.error('Error fetching cities data:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

const fetchSubCategories = async () => {
  try {
    const response = await axios.get('https://api.mahanaiim.ci/api/client/liste-des-categories');
    console.log('Fetch Subcategories API Response:', response.data);
    // Traiter les sous-catégories récupérées selon vos besoins
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error; // Rejeter ou gérer l'erreur selon vos besoins
  }
};

export default initializeAppData;
