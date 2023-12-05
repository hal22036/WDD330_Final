import { api } from "./api.mjs";
import {
  populateExerciseCards,
  populateDropdown,
  updateCompletedExercisesTable,
} from "./forms.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const equipmentSelect = document.getElementById("equipmentSelect");
  const apiKey = import.meta.env.VITE_API_KEY;

  // Get references to the select elements
  const bodyPartSelect = document.getElementById("bodyPartSelect");

  // Add event listener to bodyPartSelect
  bodyPartSelect.addEventListener("change", async () => {
    const selectedBodyPart = bodyPartSelect.value;

    try {
      // Fetch and log the body part options based on the selected body part
      const options = await api.fetchBodyPartOptions(apiKey);
      console.log("Body Part Options:", options);

      // Fetch and populate equipment options based on the selected body part
      const { uniqueEquipmentTypes } = await api.fetchExercises(
        selectedBodyPart,
        Infinity,
        apiKey,
      );

      populateDropdown(equipmentSelect, uniqueEquipmentTypes);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Add event listener to equipmentSelect
  equipmentSelect.addEventListener("change", async () => {
    const selectedBodyPart = bodyPartSelect.value;
    const selectedEquipment = equipmentSelect.value;

    // Fetch exercises based on selected body part and equipment
    const { exercises } = await api.fetchExercises(
      selectedBodyPart,
      10,
      apiKey,
    );

    // Filter exercises based on selected equipment
    const filteredExercises = exercises.filter((exercise) => {
      return selectedEquipment.includes(exercise.equipment);
    });

    // Get reference to the container element where cards will be populated
    const cardContainer = document.getElementById("container");

    // Clear previous cards
    cardContainer.innerHTML = "";

    // Check if there are no filtered exercises
    if (filteredExercises.length === 0) {
      cardContainer.innerHTML =
        "<p class='different'>Please Choose Different Equipment</p>";
    } else {
      // Populate exercise cards
      populateExerciseCards(cardContainer, filteredExercises);
    }
  });

  // Populate body part options on page load
  populateDropdown(bodyPartSelect, await api.fetchBodyPartOptions(apiKey));
});

document.addEventListener("DOMContentLoaded", () => {
  // Load completed exercises from localStorage on page load
  const completedExercises =
    JSON.parse(localStorage.getItem("completedExercises")) || [];

  // Update the completed exercises table
  updateCompletedExercisesTable(completedExercises);
});
