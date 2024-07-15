// import { db, ref, push, onValue, update, remove } from './firebase.js';

const formIdee = document.getElementById("idea-form");
const successMessage = document.getElementById("success-message");
const listeIdee = document.getElementById("ideas-list");
const categoryTable = [
  { value: "politique", label: "Politique" },
  { value: "sport", label: "Sport" },
  { value: "santé", label: "Santé" },
  { value: "education", label: "Éducation" },
];
let idee = [];

// Charge les données depuis Firebase
const ideasRef = ref(db, 'ideas');
onValue(ideasRef, (snapshot) => {
  idee = [];
  snapshot.forEach(childSnapshot => {
    const childKey = childSnapshot.key;
    const childData = childSnapshot.val();
    idee.push({ id: childKey, ...childData });
  });
  displayIdeas();
});

formIdee.addEventListener("submit", (e) => {
  e.preventDefault();

  const label = document.getElementById("label").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  let isValid = true;

  // Vérification de la validité de la catégorie
  const isValidCategory = categoryTable.some(
    (categoryObj) => categoryObj.value === category
  );

  // Validation du libellé
  if (!label) {
    errorMessage(document.getElementById("label"), "Veuillez saisir un libellé");
    isValid = false;
  } else {
    hideError(document.getElementById("label"));
  }

  // Validation de la catégorie
  if (category === "Sélectionnez une catégorie") {
    errorMessage(document.getElementById("category"), "Veuillez sélectionner une catégorie");
    isValid = false;
  } else if (!isValidCategory) {
    errorMessage(document.getElementById("category"), "Catégorie invalide. Veuillez sélectionner une catégorie valide");
    isValid = false;
  } else {
    hideError(document.getElementById("category"));
  }

  // Validation de la description
  if (description.length < 50 || description.length > 255) {
    errorMessage(document.getElementById("description"), "La description doit être comprise entre 50 et 255 caractères");
    isValid = false;
  } else {
    hideError(document.getElementById("description"));
  }

  // Si le formulaire est valide, ajouter l'idée
  if (isValid) {
    const idea = {
      label,
      category,
      description,
      approuve: false,
      status: "En attente",
    };

    // Enregistrer l'idée dans Firebase
    push(ideasRef, idea);

    displaySuccessMessage("Idée ajoutée avec succès");
    formIdee.reset();
  } else {
    displayErrorMessage("Veuillez remplir tous les champs correctement");
  }
});

// Le compteur de caractères
const descriptionInput = document.getElementById("description");
const compteur = document.createElement("span");
compteur.id = "character-count";
descriptionInput.parentNode.appendChild(compteur);

descriptionInput.addEventListener("input", () => {
  const caractere = descriptionInput.value.length;
  compteur.textContent = `${caractere} / 256`;
  if (caractere > 255) {
    descriptionInput.value = descriptionInput.value.substring(0, 255);
  }
});

// Fonction pour les messages d'erreurs
function errorMessage(input, message) {
  input.classList.add("error");
  let errorSpan = input.nextElementSibling;
  if (!errorSpan || !errorSpan.classList.contains("error-message")) {
    errorSpan = document.createElement("span");
    errorSpan.className = "error-message";
    input.parentNode.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
  setTimeout(() => {
    hideError(input);
  }, 2000);
}

// Fonction pour cacher les messages d'erreur
function hideError(input) {
  input.classList.remove("error");
  let errorSpan = input.nextElementSibling;
  if (errorSpan && errorSpan.classList.contains("error-message")) {
    input.parentNode.removeChild(errorSpan);
  }
}

function displayErrorMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.display = "none";
  }, 2000);
}

function displaySuccessMessage(message) {
  successMessage.textContent = message;
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 2000);
}

function displayIdeas() {
  listeIdee.innerHTML = "";
  idee.forEach((idea, index) => {
    let cardClass = "";
    if (idea.status === "Approuvée") {
      cardClass = "approuve";
    } else if (idea.status === "Désapprouvée") {
      cardClass = "disapproved";
    }

    const ideaHTML = `
      <div class="card ${cardClass}">
        <h3>${idea.label}</h3>
        <p><strong>Catégorie:</strong> ${idea.category}</p>
        <p><strong>Description:</strong> <br/>${idea.description}</p>
        <p><strong>Status:</strong> ${idea.status}</p>
        <div class="card-actions">
          ${
            idea.status === "En attente"
              ? `
            <i class="fas fa-thumbs-up approve-icon" data-index="${index}"></i>
            <i class="fas fa-thumbs-down disapprove-icon" data-index="${index}"></i>
          `
              : ""
          }
          <i class="fas fa-trash-alt delete-icon" data-index="${index}"></i>
        </div>
      </div>
    `;
    listeIdee.innerHTML += ideaHTML;
  });

  const approveIcons = document.querySelectorAll(".approve-icon");
  const disapproveIcons = document.querySelectorAll(".disapprove-icon");
  const deleteIcons = document.querySelectorAll(".delete-icon");

  approveIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      const ideaRef = ref(db, `ideas/${idee[index].id}`);
      update(ideaRef, { status: "Approuvée" });
    });
  });

  disapproveIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      const ideaRef = ref(db, `ideas/${idee[index].id}`);
      update(ideaRef, { status: "Désapprouvée" });
    });
  });

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      const ideaRef = ref(db, `ideas/${idee[index].id}`);
      remove(ideaRef);
    });
  });
}

displayIdeas();
