/* =========================
   GOOGLE SHEETS
========================= */

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw74EfhIQQtJDBoB0-wWRUogupTIkQN7rRoFth1u7ixanStUfCuJYBkY6al2hGPXXPT/exec";


/* =========================
   APPOINTMENT FORM
========================= */

const form =
    document.getElementById("appointmentForm");

const success =
    document.getElementById("formSuccess");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // Get customer information

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const department =
        document.getElementById("department").value;

    const date =
        document.getElementById("date").value;

    const visitingFor =
        document.getElementById("visitingFor").value;


    // Validation

    if (
        !name ||
        !phone ||
        !department ||
        !date ||
        !visitingFor
    ) {

        success.textContent =
            "Please fill in all fields.";

        success.style.color = "#d9534f";

        return;
    }


    // Submit button

    const submitButton =
        form.querySelector(
            "button[type='submit']"
        );

    submitButton.disabled = true;

    submitButton.textContent =
        "Submitting...";


    // Data that will be sent to Google Sheet

    const customerData = {

        name: name,

        phone: phone,

        department: department,

        date: date,

        visitingFor: visitingFor

    };


    try {

        await fetch(
            GOOGLE_SCRIPT_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body:
                    JSON.stringify(customerData)

            }
        );


        // Success message

        success.textContent =
            `✓ Thank you, ${name}! Your appointment request has been recived. Our team will contact you at ${phone}.`;

        success.style.color =
            "#22866f";


        // Clear form

        form.reset();


    } catch (error) {

        console.error(
            "Google Sheets Error:",
            error
        );

        success.textContent =
            "❌ Unable to submit your appointment. Please try again.";

        success.style.color =
            "#d9534f";

    }


    // Enable button

    submitButton.disabled = false;

    submitButton.textContent =
        "Request Appointment →";

});