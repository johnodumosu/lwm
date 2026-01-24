document.getElementById("findAddress").addEventListener("click", function () {
  const postcode = document.getElementById("postcode").value.trim();
  const addressList = document.getElementById("addressList");
  const addressInput = document.getElementById("address");

  addressList.innerHTML = '<option>Loading...</option>';

  if (!postcode) {
    alert("Please enter a postcode");
    return;
  }

  fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`)
    .then(res => res.json())
    .then(data => {
      if (!data.result) {
        addressList.innerHTML = '<option>No address found</option>';
        return;
      }

      const r = data.result;

      const addresses = [
        `${r.line_1 || ""} ${r.line_2 || ""}`.trim(),
        `${r.thoroughfare || ""} ${r.post_town || ""}`.trim(),
        `${r.admin_district || ""}`,
        `${r.region || ""}`,
        `${r.postcode}`
      ];

      addressList.innerHTML = '<option value="">-- Select address --</option>';

      addresses.forEach(a => {
        if (a) {
          const opt = document.createElement("option");
          opt.value = a;
          opt.textContent = a;
          addressList.appendChild(opt);
        }
      });
    })
    .catch(() => {
      addressList.innerHTML = '<option>Error finding address</option>';
    });
});


document.getElementById("addressList").addEventListener("change", function () {
  document.getElementById("address").value = this.value;
});


document.getElementById("visitorForm").addEventListener("submit", function (e) {
  e.preventDefault();

  document.getElementById("msg").innerText =
    "Thank you! Your information has been submitted.";
  document.getElementById("msg").style.color = "green";

  this.reset();
});

