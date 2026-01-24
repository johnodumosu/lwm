const API_KEY = rngtpDv_e0uWZbNmPCJZOw49871;

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

  fetch(`https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {

      if (!data.addresses || data.addresses.length === 0) {
        addressList.innerHTML = "<option>No addresses found</option>";
        return;
      }

      addressList.innerHTML = '<option value="">-- Select address --</option>';

      data.addresses.forEach(addr => {
        const clean = addr.replace(/,+/g, ",").trim();
        const option = document.createElement("option");
        option.value = clean + ", " + data.postcode;
        option.textContent = clean;
        addressList.appendChild(option);
      });
    })
    .catch(err => {
      console.error(err);
      addressList.innerHTML = "<option>Error finding address</option>";
      alert("Postcode lookup failed");
    });
});


document.getElementById("addressList").addEventListener("change", function () {
  const postcode = document.getElementById("postcode").value.trim();
  if (this.value) {
    document.getElementById("address").value = this.value + ", " + postcode;
  }
});


document.getElementById("visitorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  document.getElementById("msg").innerText =
    "Thank you! Your information has been submitted.";
  document.getElementById("msg").style.color = "green";

  this.reset();
});
