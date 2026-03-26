document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const createBtn = document.getElementById("create-activity-btn");
  const createForm = document.getElementById("create-form");
  const createActivityForm = document.getElementById("create-activity-form");
  const cancelCreate = document.getElementById("cancel-create");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants HTML
        const participantsHTML = details.participants.length > 0
          ? `<div class="participants-section">
              <h5>Participants:</h5>
              <ul class="participants-list">
                ${details.participants.map(email => `<li>${email}</li>`).join("")}
              </ul>
            </div>`
          : `<p><em>No participants yet</em></p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-container">
            ${participantsHTML}
          </div>
          <div class="admin-actions">
            <button class="edit-btn" data-activity="${name}">Edit</button>
            <button class="delete-btn" data-activity="${name}">Delete</button>
          </div>
        `;

        activitiesList.appendChild(activityCard);
      });

      // Add event listeners to edit and delete buttons
      document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", handleEdit);
      });
      document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", handleDelete);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle create activity
  createBtn.addEventListener("click", () => {
    createForm.classList.remove("hidden");
  });

  cancelCreate.addEventListener("click", () => {
    createForm.classList.add("hidden");
    createActivityForm.reset();
  });

  createActivityForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(createActivityForm);
    const data = {
      activity_name: formData.get("new-activity-name"),
      description: formData.get("new-description"),
      schedule: formData.get("new-schedule"),
      max_participants: parseInt(formData.get("new-max-participants"))
    };

    try {
      const response = await fetch("/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        createForm.classList.add("hidden");
        createActivityForm.reset();
        fetchActivities();
      } else {
        alert(result.detail || "Error creating activity");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating activity");
    }
  });

  // Handle edit (placeholder)
  function handleEdit(event) {
    const activity = event.target.getAttribute("data-activity");
    alert(`Edit ${activity} - Feature coming soon!`);
  }

  // Handle delete
  async function handleDelete(event) {
    const activity = event.target.getAttribute("data-activity");
    if (confirm(`Are you sure you want to delete ${activity}?`)) {
      try {
        const response = await fetch(`/activities/${encodeURIComponent(activity)}`, {
          method: "DELETE"
        });
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          fetchActivities();
        } else {
          alert(result.detail || "Error deleting activity");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Error deleting activity");
      }
    }
  }

  // Initial load
  fetchActivities();
});