document.getElementById("findAddress").addEventListener("click", function () {
  const postcode = document.getElementById("postcode").value.trim();
  const addressInput = document.getElementById("address");

  if (!postcode) {
    alert("Please enter a postcode");
    return;
  }

  addressInput.value = "Searching...";

  fetch("https://api.postcodes.io/postcodes/" + encodeURIComponent(postcode))
    .then(res => res.json())
    .then(data => {
      if (data.status !== 200 || !data.result) {
        addressInput.value = "";
        alert("Postcode not found");
        return;
      }

      const r = data.result;

      const address =
        (r.admin_ward || "") + ", " +
        (r.admin_district || "") + ", " +
        (r.region || "") + ", " +
        r.postcode;

      addressInput.value = address;
    })
    .catch(err => {
      console.error(err);
      addressInput.value = "";
      alert("Error looking up postcode");
    });
});


document.getElementById("visitorForm").addEventListener("submit", function (e) {
  e.preventDefault();
  document.getElementById("msg").innerText =
    "Thank you! Your information has been submitted.";
  document.getElementById("msg").style.color = "green";
  this.reset();
});
