
/* ==========================================
   KRISHNANAYAN HOSPITAL - SCRIPT.JS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       GOOGLE SHEETS CONFIGURATION
    ========================================== */

    const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbw74EfhIQQtJDBoB0-wWRUogupTIkQN7rRoFth1u7ixanStUfCuJYBkY6al2hGPXXPT/exec";


    /* ==========================================
       MOBILE NAVIGATION
    ========================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }


    /* ==========================================
       DEPARTMENT CARD SLIDER
    ========================================== */

    const departmentTrack =
        document.querySelector(".department-track");

    const prevButton =
        document.querySelector(".department-prev");

    const nextButton =
        document.querySelector(".department-next");

    if (departmentTrack && prevButton && nextButton) {

        function getScrollAmount() {

            const card =
                departmentTrack.querySelector(".department-card");

            if (!card) {
                return 300;
            }

            const trackStyle =
                window.getComputedStyle(departmentTrack);

            const gap =
                parseFloat(trackStyle.columnGap) ||
                parseFloat(trackStyle.gap) ||
                20;

            return card.getBoundingClientRect().width + gap;
        }

        nextButton.addEventListener("click", function () {

            departmentTrack.scrollBy({
                left: getScrollAmount(),
                behavior: "smooth"
            });
        });

        prevButton.addEventListener("click", function () {

            departmentTrack.scrollBy({
                left: -getScrollAmount(),
                behavior: "smooth"
            });
        });
    }


    /* ==========================================
       APPOINTMENT DATE VALIDATION
    ========================================== */

    const dateInput = document.getElementById("date");

    function getLocalDate() {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(
            today.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            today.getDate()
        ).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    if (dateInput) {
        dateInput.min = getLocalDate();
    }


    /* ==========================================
       APPOINTMENT FORM SUBMISSION
    ========================================== */

    const appointmentForm =
        document.getElementById("appointmentForm");

    const formSuccess =
        document.getElementById("formSuccess");

    if (appointmentForm) {

        appointmentForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                // Validate required HTML form fields
                if (!appointmentForm.checkValidity()) {

                    appointmentForm.reportValidity();

                    return;
                }

                // Get form values
                const nameInput =
                    appointmentForm.querySelector('[name="name"]');

                const phoneInput =
                    appointmentForm.querySelector('[name="phone"]');

                const departmentInput =
                    appointmentForm.querySelector('[name="department"]');

                const appointmentDateInput =
                    appointmentForm.querySelector('[name="date"]');

                const visitingForInput =
                    appointmentForm.querySelector('[name="visitingFor"]');


                const name = nameInput
                    ? nameInput.value.trim()
                    : "";

                const phone = phoneInput
                    ? phoneInput.value.trim()
                    : "";

                const department = departmentInput
                    ? departmentInput.value
                    : "";

                const appointmentDate = appointmentDateInput
                    ? appointmentDateInput.value
                    : "";

                const visitingFor = visitingForInput
                    ? visitingForInput.value.trim()
                    : "";


                // Validate name
                if (!name) {

                    showMessage(
                        "Please enter your full name.",
                        false
                    );

                    return;
                }


                // Validate Indian mobile number
                if (!/^[6-9]\d{9}$/.test(phone)) {

                    showMessage(
                        "Please enter a valid 10-digit Indian mobile number.",
                        false
                    );

                    return;
                }


                // Validate appointment date
                if (
                    !appointmentDate ||
                    appointmentDate < getLocalDate()
                ) {

                    showMessage(
                        "Please select today or a future appointment date.",
                        false
                    );

                    return;
                }


                // Prepare appointment data
                const customerData = {

                    name: name,

                    phone: phone,

                    department: department,

                    date: appointmentDate,

                    visitingFor: visitingFor,

                    submittedAt: new Date().toISOString()
                };


                // Find submit button
                const submitButton =
                    appointmentForm.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );

                let originalButtonText = "";

                if (submitButton) {

                    originalButtonText =
                        submitButton.tagName === "INPUT"
                            ? submitButton.value
                            : submitButton.textContent;

                    submitButton.disabled = true;

                    if (submitButton.tagName === "INPUT") {

                        submitButton.value = "Submitting...";

                    } else {

                        submitButton.textContent = "Submitting...";
                    }
                }


                showMessage(
                    "Sending your appointment request...",
                    true
                );


                try {

                    // Send appointment details to Google Apps Script
                    await fetch(GOOGLE_SCRIPT_URL, {

                        method: "POST",

                        mode: "no-cors",

                        headers: {
                            "Content-Type":
                                "text/plain;charset=utf-8"
                        },

                        body: JSON.stringify(customerData)
                    });


                    /*
                     * IMPORTANT:
                     * With no-cors mode, the response cannot be read.
                     * A resolved fetch does not confirm that Google
                     * Sheets successfully saved the appointment.
                     */

                    showMessage(
                        "Your request has been sent. Please contact the hospital to confirm your appointment.",
                        true
                    );

                    appointmentForm.reset();

                    if (dateInput) {
                        dateInput.min = getLocalDate();
                    }


                } catch (error) {

                    console.error(
                        "Appointment submission error:",
                        error
                    );

                    showMessage(
                        "Unable to send your request. Please check your internet connection and try again.",
                        false
                    );


                } finally {

                    // Restore submit button
                    if (submitButton) {

                        submitButton.disabled = false;

                        if (submitButton.tagName === "INPUT") {

                            submitButton.value =
                                originalButtonText;

                        } else {

                            submitButton.textContent =
                                originalButtonText;
                        }
                    }
                }
            }
        );
    }


    /* ==========================================
       SHOW SUCCESS OR ERROR MESSAGE
    ========================================== */

    function showMessage(message, success) {

        if (!formSuccess) {

            alert(message);

            return;
        }

        formSuccess.textContent = message;

        formSuccess.style.display = "block";

        formSuccess.style.color =
            success ? "green" : "red";

        formSuccess.setAttribute("role", "status");
    }


    /* ==========================================
       UPDATE FOOTER YEAR
    ========================================== */


    const currentYear =
        document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();
    }


    /* ==========================================
       SMOOTH SCROLL FOR INTERNAL LINKS
    ========================================== */

    document.querySelectorAll('a[href^="#"]').forEach(
        function (link) {

            link.addEventListener("click", function (event) {

                const targetId =
                    link.getAttribute("href");

                if (!targetId || targetId === "#") {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            });
        }
    );

});
