const API_KEY = "rngtpDv_e0uWZbNmPCJZOw49871" // Ensure this key is active and domain-whitelisted

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

  fetch(`https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${API_KEY}&expand=true`)
    .then(res => {
      if (res.status === 401) throw new Error("Invalid API Key or Domain not whitelisted");
      if (res.status === 404) throw new Error("Postcode not found");
      if (!res.ok) throw new Error("API error");
      return res.json();
    })
    .then(data => {
      addressList.innerHTML = '<option value="">-- Select address --</option>';

      if (!data.addresses || data.addresses.length === 0) {
        addressList.innerHTML = "<option>No addresses found</option>";
        return;
      }

      data.addresses.forEach(addr => {
        // If using 'expand=true', addr is an object. 
        // If not, it's a string. This handles the string version in your original code:
        const formattedAddress = Array.isArray(addr) ? addr.filter(x => x).join(", ") : addr.replace(/,+/g, ", ").trim();
        
        const option = document.createElement("option");
        option.value = formattedAddress + ", " + data.postcode;
        option.textContent = formattedAddress;
        addressList.appendChild(option);
      });
    })
    .catch(err => {
      console.error(err);
      addressList.innerHTML = "<option>Error</option>";
      alert(err.message);
    });
});

// Update the text box when an address is chosen
document.getElementById("addressList").addEventListener("change", function () {
  if (this.value) {
    document.getElementById("address").value = this.value;
  }
});
