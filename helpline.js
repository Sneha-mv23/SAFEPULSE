// helpline.js

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
  addContactBtn.addEventListener("click", () => {
    const name = contactNameInput.value.trim();
    const number = contactNumberInput.value.trim();

    if (name && number && /^[0-9]{3,15}$/.test(number)) {
      const newContact = document.createElement("li");
      newContact.innerHTML = `<strong>${name}:</strong> <a href="tel:${number}">${number}</a>`;
      if (contactList.children[0]?.textContent === "No contacts added yet.") {
        contactList.innerHTML = "";
      }
      contactList.appendChild(newContact);

      // Clear input fields
      contactNameInput.value = "";
      contactNumberInput.value = "";
    } else {
      alert("Please enter a valid name and phone number (digits only).");
    }
  });
});
