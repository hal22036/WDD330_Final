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
      console.log("Unique Equipment Types in main.js:", uniqueEquipmentTypes);

      // Pass the options directly, not as a function
      populateDropdown(equipmentSelect, uniqueEquipmentTypes);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Add event listener to equipmentSelect
  equipmentSelect.addEventListener("change", async () => {
    const selectedBodyPart = bodyPartSelect.value;
    const selectedEquipment = equipmentSelect.value;

    console.log("Selected Body Part:", selectedBodyPart);
    console.log("Selected Equipment:", selectedEquipment);

    // Fetch exercises based on selected body part and equipment
    const { exercises } = await api.fetchExercises(
      selectedBodyPart,
      10,
      apiKey,
    );

    console.log("API response:", exercises);
    console.log("Selected Equipment:", selectedEquipment);

    // Filter exercises based on selected equipment
    const filteredExercises = exercises.filter((exercise) => {
      console.log("Checking exercise:", exercise);
      return selectedEquipment.includes(exercise.equipment);
    });

    // Log the filtered exercises to check if the filtering is working as expected
    console.log("Filtered Exercises:", filteredExercises);

    // Get reference to the container element where cards will be populated
    const cardContainer = document.getElementById("container");

    // Clear previous cards
    cardContainer.innerHTML = "";

    // Check if there are no filtered exercises
    if (filteredExercises.length === 0) {
      // Display a message in the container
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
