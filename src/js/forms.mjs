export function populateExerciseCards(containerElement, exercises) {
  // Create a title element
  const titleElement = document.createElement("h2");
  titleElement.textContent = "Click a card to do an exercise";
  containerElement.appendChild(titleElement);

  // Create a container for the cards
  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";
  containerElement.appendChild(cardContainer);

  exercises.forEach((exercise) => {
    const card = document.createElement("div");
    card.className = "card";

    // Create an image element for the gifUrl
    const imgElement = document.createElement("img");
    imgElement.src = exercise.gifUrl;
    imgElement.alt = exercise.name; 
    card.appendChild(imgElement);

    // Create a paragraph element for the exercise name
    const nameElement = document.createElement("p");
    nameElement.textContent = exercise.name;
    card.appendChild(nameElement);

    // Add event listener to the card
    card.addEventListener("click", () => {
      // Populate the chosenCard section
      populateChosenCard(exercise);
    });

    cardContainer.appendChild(card);
  });
}

// Function to populate the chosenCard section
function populateChosenCard(exercise) {
  const chosenCardSection = document.getElementById("chosenCard");
  chosenCardSection.innerHTML = ""; 

  // Create a container for the chosen card content
  const cardContentContainer = document.createElement("div");
  cardContentContainer.className = "chosen-card-content";
  chosenCardSection.appendChild(cardContentContainer);

  // Create an image element for the gifUrl
  const imgElement = document.createElement("img");
  imgElement.src = exercise.gifUrl;
  imgElement.alt = exercise.name; 
  cardContentContainer.appendChild(imgElement);

  // Create a container for exercise details (name, instructions, and button)
  const exerciseDetailsContainer = document.createElement("div");
  exerciseDetailsContainer.className = "exercise-details-content";
  cardContentContainer.appendChild(exerciseDetailsContainer);

  // Create a heading for the exercise name
  const nameElement = document.createElement("h3");
  nameElement.textContent = exercise.name;
  exerciseDetailsContainer.appendChild(nameElement);

  // Create an ordered list for instructions
  const instructionsList = document.createElement("ol");
  exercise.instructions.forEach((instruction) => {
    const instructionItem = document.createElement("li");
    instructionItem.textContent = instruction;
    instructionsList.appendChild(instructionItem);
  });
  exerciseDetailsContainer.appendChild(instructionsList);

  // Add Completed button
  const completedButton = document.createElement("button");
  completedButton.textContent = "Exercise Complete";
  completedButton.className = "completed-button"; 
  completedButton.addEventListener("click", () => {
    // Handle completion and update table
    handleExerciseCompletion(exercise);
  });
  exerciseDetailsContainer.appendChild(completedButton);
}



function handleExerciseCompletion(exercise) {
  // Get the completed exercises from localStorage
  const completedExercises = JSON.parse(localStorage.getItem("completedExercises")) || [];

  // Add the completed exercise
  completedExercises.push({
    name: exercise.name,
    equipment: exercise.equipment || "N/A", 
    date: new Date().toLocaleDateString(),
  });

  // Save the updated completed exercises to localStorage
  localStorage.setItem("completedExercises", JSON.stringify(completedExercises));

  // Update the completed exercises table
  updateCompletedExercisesTable(completedExercises);
}

export function updateCompletedExercisesTable(completedExercises) {
  const table = document.getElementById("completedExercisesTable");
  const tableContainer = document.querySelector(".completed-exercises-container");

  // Check if there are completed exercises
  if (completedExercises.length === 0) {
    table.style.display = "none"; 
    tableContainer.style.display = "none"; 
    return;
  } else {
    table.style.display = "table"; 
    tableContainer.style.display = "block"; 
  }

  const tableBody = table.querySelector("tbody");
  tableBody.innerHTML = ""; 

  completedExercises.forEach((exercise) => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = exercise.name;
    row.insertCell(1).textContent = exercise.equipment;
    row.insertCell(2).textContent = exercise.date;
  });
}

// Add a class to the containerElement for styling
const containerElement = document.getElementById("container"); 
containerElement.classList.add("container");


export function populateDropdown(selectElement, options) {
  selectElement.innerHTML = "";

  // Ensure options is an array
  const optionsArray = Array.isArray(options) ? options : [options];

  const defaultOption = document.createElement("option");
  defaultOption.text = "Select an option";
  defaultOption.value = "";
  selectElement.add(defaultOption);

  // Create and append option elements
  optionsArray.forEach((option) => {
    const optionElement = document.createElement("option");

    // Handle both array and object cases
    const optionValue = typeof option === "object" ? option.value : option;

    optionElement.value = optionValue;
    optionElement.text = optionValue;
    selectElement.appendChild(optionElement);
  });
}
