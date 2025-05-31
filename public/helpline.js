document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const allSections = document.querySelectorAll(".helpline-category");
  const contactNameInput = document.getElementById("contact-name");
  const contactNumberInput = document.getElementById("contact-number");
  const addContactBtn = document.getElementById("add-contact-btn");
  const contactList = document.getElementById("custom-contact-list");

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    allSections.forEach(section => {
      const matches = Array.from(section.querySelectorAll("li")).some(li => 
        li.textContent.toLowerCase().includes(query)
      );
      section.style.display = matches ? "block" : "none";
    });
  });

  // Add custom contact
  addContactBtn.addEventListener("click", async () => {
    const name = contactNameInput.value.trim();
    const number = contactNumberInput.value.trim();

    if (name && number && /^[0-9]{3,15}$/.test(number)) {
      // Save to backend
      try {
        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, number }),
        });

        const data = await res.json();
        if (res.ok) {
          // Add to UI
          const newContact = document.createElement("li");
          newContact.innerHTML = `<strong>${name}:</strong> <a href="tel:${number}">${number}</a>`;
          if (contactList.children[0]?.textContent === "No contacts added yet.") {
            contactList.innerHTML = "";
          }
          contactList.appendChild(newContact);
          contactNameInput.value = "";
          contactNumberInput.value = "";
        } else {
          alert(data.error || "Failed to save contact.");
        }
      } catch (err) {
        console.error("Error saving contact:", err);
        alert("Something went wrong while saving contact.");
      }
    } else {
      alert("Please enter a valid name and phone number (digits only).");
    }
  });

  // Load contacts from backend
  async function loadContacts() {
    try {
      const response = await fetch("/api/contacts");
      const contacts = await response.json();

      if (contacts.length > 0) {
        contactList.innerHTML = "";
        contacts.forEach(({ name, number }) => {
          const contactItem = document.createElement("li");
          contactItem.innerHTML = `<strong>${name}:</strong> <a href="tel:${number}">${number}</a>`;
          contactList.appendChild(contactItem);
        });
      }
    } catch (err) {
      console.error("Error loading contacts:", err);
    }
  }

  // Call it after DOM is ready
  loadContacts();
});


