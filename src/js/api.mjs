const apiHost = "exercisedb.p.rapidapi.com";

export const api = {
  async fetchBodyPartOptions(apiKey) {
    try {
      const url = "https://exercisedb.p.rapidapi.com/exercises/bodyPartList";
      const response = await fetchData(url, apiKey);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch body part options. Status: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Error fetching body part options:", error);
      return [];
    }
  },

  async fetchExercises(bodyPart, limit = Infinity, apiKey) {
    try {
        const encodedBodyPart = encodeURIComponent(bodyPart);
    
        const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${encodedBodyPart}?limit=${limit}`;
        const response = await fetchData(url, apiKey);
    
        if (!response.ok) {
          throw new Error(`Failed to fetch exercises. Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        // Ensure that the data is an array
        const exercises = Array.isArray(data) ? data : (data.exercises ? data.exercises : [data]);    
    
        // Check if exercises is not an array or is empty
        if (!Array.isArray(exercises) || exercises.length === 0) {
          throw new Error('Invalid or empty exercises data');
        }    
        // Build an array of unique equipment types
        const uniqueEquipmentTypes = Array.from(new Set(exercises.flatMap(exercise => exercise.equipment || []))).map(equipment => ({ value: equipment }));
            
        return { exercises, uniqueEquipmentTypes };
      } catch (error) {
        console.error('Error fetching exercises:', error);
        return { exercises: [], uniqueEquipmentTypes: [] };
    }
  },
};

async function fetchData(url, apiKey) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { ok: false };
  }
}