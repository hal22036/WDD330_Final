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
    imgElement.alt = exercise.name; // Use exercise name as alt text
    card.appendChild(imgElement);

    // Create a paragraph element for the exercise name
    const nameElement = document.createElement("p");
    nameElement.textContent = exercise.name;
    card.appendChild(nameElement);

    cardContainer.appendChild(card);
  });
}

// Add a class to the containerElement for styling
const containerElement = document.getElementById("container"); // Replace with the actual ID of your container
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
