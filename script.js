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

// charge les données stockées en local
if (localStorage.getItem("ideas")) {
  idee = JSON.parse(localStorage.getItem("ideas"));
}
const categorySelect = document.getElementById("category");

formIdee.addEventListener("submit", (e) => {
  e.preventDefault();

  const label = document.getElementById("label").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  let isValid = true;
  const selectedCategory = categorySelect.value;
  const isValidCategory = categoryTable.some(
    (category) => category.value === selectedCategory
  );

  if (!label) {
    errorMessage(document.getElementById("label"), "Veuillez saisir un libellé");
    isValid = false;
  } else {
    hideError(document.getElementById("label"));
  }

  if (category === "Sélectionnez une catégorie") {
    errorMessage(
      document.getElementById("category"),
      "Veuillez sélectionner une catégorie"
    );
    isValid = false;
  } else {
    hideError(document.getElementById("category"));
  }

  if (!description) {
    errorMessage(
      document.getElementById("description"),
      "Veuillez saisir une description"
    );
    isValid = false;
  } else {
    hideError(document.getElementById("description"));
  }
  if (description.length > 255) {
    errorMessage(
        document.getElementById("description"),
        "la description ne doit pas depassé 255 caractere"
      );
      isValid = false;
  } 

  if (!isValid) {
    displayErrorMessage("Veuillez remplir tous les champs");
    return;
  }
  if (!isValidCategory) {
    errorMessage(
      document.getElementById("category"),
      "Catégorie invalide. Veuillez sélectionner une catégorie valide"
    );
    return;
  }
  const idea = {
    label,
    category,
    description,
    appouver: false,
    status: "En attente",
  };

  idee.push(idea);
  // Enregistrer les idées en local
  localStorage.setItem("ideas", JSON.stringify(idee));

  displaySuccessMessage("Idée ajoutée avec succès");
  displayIdeas();
  formIdee.reset();
});

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
      cardClass = "appouver";
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
      idee[index].status = "Approuvée";
      localStorage.setItem("ideas", JSON.stringify(idee));
      displayIdeas();
    });
  });

  disapproveIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      idee[index].status = "Désapprouvée";
      localStorage.setItem("ideas", JSON.stringify(idee));
      displayIdeas();
    });
  });

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.getAttribute("data-index");
      idee.splice(index, 1);
      localStorage.setItem("ideas", JSON.stringify(idee));
      displayIdeas();
    });
  });
}

displayIdeas();
