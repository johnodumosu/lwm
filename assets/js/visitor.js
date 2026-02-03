
// Initialize the address lookup
getAddress.find("container", "rngtpDv_e0uWZbNmPCJZOw49871", {
    output_fields: {
        line_1: "#address",
        line_2: "#address",
        line_3: "#address",
        post_town: "#address",
        postcode: "#address"
    }
});

// Customizing the lookup UI
const interval = setInterval(() => {
    const input = document.querySelector('#container input');
    const button = document.querySelector('#container button');

    if (input && button) {
        input.placeholder = "Post Code";
        button.textContent = "Find Address";
        clearInterval(interval);
    }
}, 50);