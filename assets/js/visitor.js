const API_KEY = "rngtpDv_e0uWZbNmPCJZOw49871";

document.getElementById("findAddress").addEventListener("click", function () {
  const postcode = document.getElementById("postcode").value.trim();
  const addressList = document.getElementById("addressList");
  const addressInput = document.getElementById("address");

  if (!postcode) {
    alert("Please enter a postcode");
    return;
  }

  addressList.innerHTML = "<option>Searching...</option>";
  addressInput.value = "";

  // Added 'expand=true' to get cleaner address formatting
  fetch(`https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${API_KEY}&expand=true`)
    .then(res => {
      if (res.status === 401) throw new Error("API Key invalid or Domain not whitelisted in getAddress.io dashboard.");
      if (res.status === 404) throw new Error("Postcode not found.");
      if (!res.ok) throw new Error("Connection error.");
      return res.json();
    })
    .then(data => {
      if (!data.addresses || data.addresses.length === 0) {
        addressList.innerHTML = "<option>No addresses found</option>";
        return;
      }

      addressList.innerHTML = '<option value="">-- Select address --</option>';

      data.addresses.forEach(addr => {
        // Formats the address array into a clean string, removing empty parts
        const fullAddress = addr.filter(part => part && part.trim() !== "").join(", ");
        
        const option = document.createElement("option");
        option.value = `${fullAddress}, ${data.postcode}`;
        option.textContent = fullAddress;
        addressList.appendChild(option);
      });
    })
    .catch(err => {
      console.error("Lookup Error:", err);
      addressList.innerHTML = "<option>Error finding address</option>";
      alert(err.message);
    });
});

// Update the main address input when a dropdown item is selected
document.getElementById("addressList").addEventListener("change", function () {
  if (this.value) {
    document.getElementById("address").value = this.value;
  }
});

// Form Submission logic
document.getElementById("visitorForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const msg = document.getElementById("msg");
  msg.innerText = "Thank you! Your information has been submitted.";
  msg.style.color = "green";
  this.reset();
});
