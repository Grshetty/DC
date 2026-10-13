// Ensure website always starts from top only on open or reload
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', () => window.scrollTo(0, 0));

/* =======================================================
   CINEMATIC VIDEO INTRO (Plays only on site open or page reload)
======================================================== */

const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const introSkipBtn = document.getElementById("introSkipBtn");

if (intro) {
    let introEnded = false;
    let fallbackTimer = null;

    const finishIntro = () => {
        if (introEnded) return;
        introEnded = true;
        if (fallbackTimer) clearTimeout(fallbackTimer);

        intro.classList.add("hide");
        document.body.classList.remove("intro-active");

        if (introVideo) {
            try {
                introVideo.pause();
            } catch (e) {}
        }
    };

    try {
        const nav = window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation")[0];
        const isReload = nav ? nav.type === "reload" : (window.performance && window.performance.navigation && window.performance.navigation.type === 1);
        const hasVisited = sessionStorage.getItem("site_intro_played");

        if (!hasVisited || isReload) {
            // Fresh tab or page reload
            sessionStorage.setItem("site_intro_played", "true");
            document.body.classList.add("intro-active");

            // Skip button listener
            if (introSkipBtn) {
                introSkipBtn.addEventListener("click", finishIntro);
            }

            // Keyboard shortcut (Escape or Space to skip)
            const handleKeydown = (e) => {
                if (e.key === "Escape" || e.code === "Space") {
                    finishIntro();
                    window.removeEventListener("keydown", handleKeydown);
                }
            };
            window.addEventListener("keydown", handleKeydown);

            if (introVideo) {
                // Ensure muted for strict browser autoplay policies
                introVideo.muted = true;
                const playPromise = introVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Autoplay was prevented or postponed:", err);
                    });
                }

                // Smoothly finish when video playback completes naturally
                introVideo.addEventListener("ended", () => {
                    setTimeout(finishIntro, 500);
                });

                // Safety timeout fallback (video is ~7s, fallback at 8.5s)
                fallbackTimer = setTimeout(finishIntro, 8500);
            } else {
                fallbackTimer = setTimeout(finishIntro, 2500);
            }
        } else {
            // Already visited in this session and not reloaded
            finishIntro();
        }
    } catch (err) {
        finishIntro();
    }
}


/* =======================================================
   NAVBAR SCROLL
======================================================== */

const navbar =
    document.getElementById("navbar");

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    },
    { passive: true }
);


/* =======================================================
   MOBILE MENU
======================================================== */

const menuToggle =
    document.getElementById("menuToggle");

menuToggle.addEventListener(
    "click",
    () => {

        navbar.classList.toggle("mobile-open");

        menuToggle.textContent =
            navbar.classList.contains("mobile-open")
                ? "×"
                : "☰";

    }
);


document
    .querySelectorAll(".nav-links a")
    .forEach(link => {

        link.addEventListener(
            "click",
            () => {

                navbar.classList.remove(
                    "mobile-open"
                );

                menuToggle.textContent = "☰";

            }
        );

    });


/* =======================================================
   HERO SLIDER
======================================================== */

const slides =
    document.querySelectorAll(".hero-slide");

const heroCounter =
    document.querySelector(".hero-counter");

let currentSlide = 0;

function showSlide(index) {

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    currentSlide = index;

    slides[currentSlide].classList.add("active");

    heroCounter.textContent =
        `0${currentSlide + 1} / 03`;

}

setInterval(() => {

    showSlide(
        (currentSlide + 1) % slides.length
    );

}, 3000);


/* =======================================================
   SCROLL REVEAL
======================================================== */

const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "in-view"
                    );

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: .12
        }
    );


document
    .querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    )
    .forEach(element => {

        revealObserver.observe(element);

    });


/* =======================================================
   COUNTERS
======================================================== */

const counters =
    document.querySelectorAll(
        ".stat-number"
    );

let countersStarted = false;

const counterObserver =
    new IntersectionObserver(
        entries => {

            if (
                entries.some(
                    entry => entry.isIntersecting
                )
                &&
                !countersStarted
            ) {

                countersStarted = true;

                counters.forEach(counter => {

                    const target =
                        Number(
                            counter.dataset.target
                        );

                    let current = 0;

                    const increment =
                        Math.max(
                            1,
                            Math.ceil(target / 45)
                        );

                    const timer =
                        setInterval(() => {

                            current += increment;

                            if (current >= target) {

                                current = target;

                                clearInterval(timer);

                            }

                            const suffix =
                                counter
                                    .querySelector("span")
                                    ?.outerHTML || "";

                            counter.innerHTML =
                                `${current}${suffix}`;

                        }, 35);

                });

            }

        },
        {
            threshold: .35
        }
    );


const stats =
    document.querySelector(".stats");

if (stats) {
    counterObserver.observe(stats);
}


/* =======================================================
   PROJECT FILTER
======================================================== */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );


filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const filter =
                button.dataset.filter;

            projectCards.forEach(
                (card, index) => {

                    const category =
                        card.dataset.category;

                    const shouldShow =
                        filter === "all" ||
                        category === filter;

                    if (shouldShow) {

                        card.style.display = "";

                        card.animate(
                            [
                                {
                                    opacity: 0,
                                    transform:
                                        "translateY(15px)"
                                },
                                {
                                    opacity: 1,
                                    transform:
                                        "translateY(0)"
                                }
                            ],
                            {
                                duration: 450,
                                delay: index * 40,
                                easing:
                                    "cubic-bezier(.2,.7,.2,1)"
                            }
                        );

                    } else {

                        card.style.display = "none";

                    }

                }
            );

        }
    );

});


/* =======================================================
   PROJECT DATA  (6 images per project)
======================================================== */

const projectData = [

    {
        title:
            "The Grand Residences",

        status:
            "Ongoing",

        location:
            "Hyderabad",

        type:
            "Premium Residences",

        category:
            "Residential",

        images: [
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600607687939-3c2e7ef12aa5?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "A thoughtfully planned residential development combining contemporary architecture, refined interiors and carefully designed community spaces."
    },


    {
        title:
            "Aurelia Heights",

        status:
            "Upcoming",

        location:
            "Bengaluru",

        type:
            "Luxury Apartments",

        category:
            "Residential",

        images: [
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "A premium apartment development designed around natural light, elegant proportions and modern urban living."
    },


    {
        title:
            "Terra Villas",

        status:
            "Completed",

        location:
            "Hyderabad",

        type:
            "Luxury Villas",

        category:
            "Residential",

        images: [
            "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600047509782-20d39509f26d?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "A collection of contemporary villas created with a strong emphasis on privacy, functionality and timeless design."
    },


    {
        title:
            "Vertex Business Park",

        status:
            "Ongoing",

        location:
            "Hyderabad",

        type:
            "Commercial",

        category:
            "Commercial",

        images: [
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1541976590-713941681591?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "A modern commercial destination planned to support productive workplaces, flexible business environments and a premium visitor experience."
    },


    {
        title:
            "Eden Courtyard",

        status:
            "Completed",

        location:
            "Secunderabad",

        type:
            "Residential",

        category:
            "Premium",

        images: [
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "A completed residential development focused on warm material palettes, practical layouts and comfortable everyday living."
    },


    {
        title:
            "The Haven",

        status:
            "Upcoming",

        location:
            "Hyderabad",

        type:
            "Premium Villas",

        category:
            "Luxury",

        images: [
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1400&q=90",
            "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=1400&q=90"
        ],

        description:
            "An upcoming villa development envisioned around spacious planning, contemporary architecture and a calm residential environment."
    }

];


/* =======================================================
   CAROUSEL STATE
======================================================== */

let carouselIndex = 0;
let carouselImages = [];

function buildCarousel(images) {

    const track   = document.getElementById("carouselTrack");
    const dotsWrap = document.getElementById("carouselDots");

    // Clear previous content
    track.innerHTML   = "";
    dotsWrap.innerHTML = "";

    carouselImages = images;
    carouselIndex  = 0;

    // Build image elements
    images.forEach((src, i) => {

        const img = document.createElement("img");
        img.src   = src;
        img.alt   = `Project image ${i + 1}`;
        track.appendChild(img);

    });

    // Build dot buttons
    images.forEach((_, i) => {

        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Go to image ${i + 1}`);

        dot.addEventListener("click", () => goToCarousel(i));

        dotsWrap.appendChild(dot);

    });

    // Position track at index 0
    track.style.transform = "translateX(0%)";

}

function goToCarousel(index) {

    const track   = document.getElementById("carouselTrack");
    const dots    = document.querySelectorAll(".carousel-dot");

    // Clamp
    const total = carouselImages.length;
    carouselIndex = (index + total) % total;

    track.style.transform =
        `translateX(-${carouselIndex * 100}%)`;

    dots.forEach((d, i) => {
        d.classList.toggle("active", i === carouselIndex);
    });

}


/* =======================================================
   OPEN PROJECT
======================================================== */

function openProject(index) {

    const project = projectData[index];

    // Build carousel with 6 images
    buildCarousel(project.images);

    // Populate text fields
    document.getElementById("modalProjectTitle").textContent     = project.title;
    document.getElementById("modalProjectStatus").textContent    = project.status;
    document.getElementById("modalProjectDescription").textContent = project.description;
    document.getElementById("modalLocation").textContent         = project.location;
    document.getElementById("modalType").textContent             = project.type;
    document.getElementById("modalStatus").textContent           = project.status;
    document.getElementById("modalCategory").textContent         = project.category;

    openModal("projectModal");

}


/* =======================================================
   CAROUSEL ARROW LISTENERS
======================================================== */

document.getElementById("carouselPrev").addEventListener("click", () => {
    goToCarousel(carouselIndex - 1);
});

document.getElementById("carouselNext").addEventListener("click", () => {
    goToCarousel(carouselIndex + 1);
});




/* =======================================================
   MODAL
======================================================== */

function openModal(id) {

    const modal =
        document.getElementById(id);

    modal.classList.add("active");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    modal.classList.remove("active");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeModal(modal.id);

                }

            }
        );

    });


/* =======================================================
   ESCAPE CLOSE
======================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal.active")
                .forEach(modal => {

                    closeModal(modal.id);

                });

        }

    }
);


/* =======================================================
   ENQUIRY
======================================================== */

function openEnquiry() {

    closeModal("projectModal");

    openModal("enquiryModal");

}


/* =======================================================
   ENQUIRY FORM VALIDATION & SUBMISSION
======================================================== */

function initEnquiryFormValidation() {
    const form = document.getElementById("enquiryForm");
    if (!form) return;

    const nameInput = form.querySelector("#name");
    const phoneInput = form.querySelector("#phone");
    const emailInput = form.querySelector("#email");
    const projectTypeInput = form.querySelector("#projectType");
    const messageInput = form.querySelector("#message");
    const successMsg = document.getElementById("successMessage");
    const charCounter = document.getElementById("messageCount");

    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");
    const emailError = document.getElementById("emailError");
    const projectTypeError = document.getElementById("projectTypeError");
    const messageError = document.getElementById("messageError");

    function setError(input, errorEl, msg) {
        if (input) input.classList.add("input-error");
        if (errorEl) {
            errorEl.textContent = msg;
            errorEl.classList.add("active");
        }
    }

    function clearError(input, errorEl) {
        if (input) input.classList.remove("input-error");
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.classList.remove("active");
        }
    }

    // 1. FULL NAME: Max 50, only alphabets and single space
    if (nameInput) {
        nameInput.setAttribute("maxlength", "50");
        nameInput.addEventListener("input", () => {
            let val = nameInput.value;
            val = val.replace(/[^a-zA-Z ]/g, ""); // only alphabets and spaces
            val = val.replace(/^ +/, "");          // no leading space
            val = val.replace(/ {2,}/g, " ");      // collapse multiple spaces to single space
            if (val.length > 50) val = val.slice(0, 50);
            nameInput.value = val;

            if (val.length > 0) {
                validateName(false);
            } else {
                clearError(nameInput, nameError);
            }
        });
        nameInput.addEventListener("blur", () => validateName(true));
    }

    function validateName(showEmpty = true) {
        if (!nameInput) return true;
        const val = nameInput.value.trim();
        if (!val) {
            if (showEmpty) setError(nameInput, nameError, "Full Name is mandatory and cannot be empty.");
            return false;
        }
        if (val.length < 2) {
            setError(nameInput, nameError, "Full Name must be at least 2 characters.");
            return false;
        }
        if (val.length > 50) {
            setError(nameInput, nameError, "Full Name cannot exceed 50 characters.");
            return false;
        }
        if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(val)) {
            setError(nameInput, nameError, "Name must contain only alphabets and single spaces.");
            return false;
        }
        clearError(nameInput, nameError);
        return true;
    }

    // 2. PHONE NUMBER: Must be 10 digits, numbers only, no spaces
    if (phoneInput) {
        phoneInput.setAttribute("maxlength", "10");
        phoneInput.addEventListener("input", () => {
            let val = phoneInput.value;
            val = val.replace(/\D/g, ""); // numbers only, no spaces
            if (val.length > 10) val = val.slice(0, 10);
            phoneInput.value = val;

            if (val.length > 0) {
                validatePhone(false);
            } else {
                clearError(phoneInput, phoneError);
            }
        });
        phoneInput.addEventListener("blur", () => validatePhone(true));
    }

    function validatePhone(showEmpty = true) {
        if (!phoneInput) return true;
        const val = phoneInput.value.trim();
        if (!val) {
            if (showEmpty) setError(phoneInput, phoneError, "Phone Number is mandatory and cannot be empty.");
            return false;
        }
        if (val.length !== 10) {
            setError(phoneInput, phoneError, "Phone Number must be exactly 10 digits (numbers only, no spaces).");
            return false;
        }
        if (!/^\d{10}$/.test(val)) {
            setError(phoneInput, phoneError, "Phone Number must contain only digits.");
            return false;
        }
        clearError(phoneInput, phoneError);
        return true;
    }

    // 3. EMAIL: Max 70, only letters, digits, '@' and '.', no spaces
    if (emailInput) {
        emailInput.setAttribute("maxlength", "70");
        emailInput.addEventListener("input", () => {
            let val = emailInput.value;
            val = val.replace(/[^a-zA-Z0-9@.]/g, ""); // only letters, digits, @, and .
            if (val.length > 70) val = val.slice(0, 70);
            emailInput.value = val;

            if (val.length > 0) {
                validateEmail(false);
            } else {
                clearError(emailInput, emailError);
            }
        });
        emailInput.addEventListener("blur", () => validateEmail(true));
    }

    function validateEmail(showEmpty = true) {
        if (!emailInput) return true;
        const val = emailInput.value.trim();
        if (!val) {
            if (showEmpty) setError(emailInput, emailError, "Email is mandatory and cannot be empty.");
            return false;
        }
        if (val.length > 70) {
            setError(emailInput, emailError, "Email cannot exceed 70 characters.");
            return false;
        }
        if (val.includes(" ")) {
            setError(emailInput, emailError, "Email cannot contain spaces.");
            return false;
        }
        if (/[^a-zA-Z0-9@.]/.test(val)) {
            setError(emailInput, emailError, "Only letters, digits, '@' and '.' are allowed.");
            return false;
        }
        const atCount = (val.match(/@/g) || []).length;
        if (atCount !== 1) {
            setError(emailInput, emailError, "Email must contain exactly one '@'.");
            return false;
        }
        // Valid email pattern using only letters, numbers, @, and .
        const emailRegex = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/;
        if (!emailRegex.test(val)) {
            setError(emailInput, emailError, "Please enter a valid email address (e.g. name@domain.com).");
            return false;
        }
        clearError(emailInput, emailError);
        return true;
    }

    // 4. PROJECT TYPE: Mandatory dropdown
    if (projectTypeInput) {
        projectTypeInput.addEventListener("change", () => validateProjectType(true));
    }

    function validateProjectType(showEmpty = true) {
        if (!projectTypeInput) return true;
        const val = projectTypeInput.value.trim();
        if (!val) {
            if (showEmpty) setError(projectTypeInput, projectTypeError, "Please select a project type.");
            return false;
        }
        clearError(projectTypeInput, projectTypeError);
        return true;
    }

    // 5. TEXTAREA (REQUIREMENT): Max 100, only alphabets and single spaces
    if (messageInput) {
        messageInput.setAttribute("maxlength", "100");
        messageInput.addEventListener("input", () => {
            let val = messageInput.value;
            val = val.replace(/[^a-zA-Z ]/g, ""); // only alphabets and spaces
            val = val.replace(/^ +/, "");          // no leading space
            val = val.replace(/ {2,}/g, " ");      // single space only
            if (val.length > 100) val = val.slice(0, 100);
            messageInput.value = val;

            if (charCounter) {
                charCounter.textContent = `${val.length} / 100`;
            }

            if (val.length > 0) {
                validateMessage(false);
            } else {
                clearError(messageInput, messageError);
            }
        });
        messageInput.addEventListener("blur", () => validateMessage(true));
    }

    function validateMessage(showEmpty = true) {
        if (!messageInput) return true;
        const val = messageInput.value.trim();
        if (!val) {
            if (showEmpty) setError(messageInput, messageError, "Requirement is mandatory and cannot be empty.");
            return false;
        }
        if (val.length < 3) {
            setError(messageInput, messageError, "Requirement must be at least 3 characters.");
            return false;
        }
        if (val.length > 100) {
            setError(messageInput, messageError, "Requirement cannot exceed 100 characters.");
            return false;
        }
        if (!/^[a-zA-Z]+( [a-zA-Z]+)*$/.test(val)) {
            setError(messageInput, messageError, "Only alphabets and single spaces are allowed.");
            return false;
        }
        clearError(messageInput, messageError);
        return true;
    }

    // SUBMIT HANDLER: Strictly blocks empty or invalid submission
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const isNameValid = validateName(true);
        const isPhoneValid = validatePhone(true);
        const isEmailValid = validateEmail(true);
        const isProjectValid = validateProjectType(true);
        const isMessageValid = validateMessage(true);

        if (!isNameValid || !isPhoneValid || !isEmailValid || !isProjectValid || !isMessageValid) {
            const firstInvalid = form.querySelector(".input-error");
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const email = emailInput.value.trim();
        const projectType = projectTypeInput.value;
        const message = messageInput.value.trim();

        const whatsappNumber = "7981227221";
        const whatsappMessage = `Enquiry\nDHRUVANTHEERA CONSTRUCTIONS\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject Type: ${projectType}\nRequirement: ${message}`;

        const whatsappURL =
            "https://wa.me/" + whatsappNumber +
            "?text=" + encodeURIComponent(whatsappMessage);

        const whatsappWindow = window.open(whatsappURL, "_blank");

        if (successMsg) {
            successMsg.textContent = whatsappWindow
                ? "Your enquiry is ready in WhatsApp. Please press Send to complete your enquiry."
                : "Please allow pop-ups for this website, then submit your enquiry again.";
            successMsg.classList.add("show");
        }

        form.reset();
        if (charCounter) charCounter.textContent = "0 / 100";
    });
}

initEnquiryFormValidation();


/* =======================================================
   HERO MOUSE CINEMATIC MOVEMENT
======================================================== */

const hero =
    document.querySelector(".hero");

const reducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

const finePointer =
    window.matchMedia(
        "(pointer: fine)"
    ).matches;


if (
    hero &&
    finePointer &&
    !reducedMotion
) {

    hero.addEventListener(
        "mousemove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    .5) * 2;

            const y =
                (event.clientY /
                    window.innerHeight -
                    .5) * 2;

            const activeSlide =
                document.querySelector(
                    ".hero-slide.active"
                );

            if (activeSlide) {

                activeSlide.style.transform =
                    `scale(1.1)
       translate(${x * -4}px, ${y * -3}px)`;

            }

        }
    );

    hero.addEventListener(
        "mouseleave",
        () => {

            const activeSlide =
                document.querySelector(
                    ".hero-slide.active"
                );

            if (activeSlide) {

                activeSlide.style.transform =
                    "scale(1.08)";

            }

        }
    );

}


/* =======================================================
   CLOSE MOBILE MENU ON RESIZE
======================================================== */

window.addEventListener(
    "resize",
    () => {

        if (window.innerWidth > 900) {

            navbar.classList.remove(
                "mobile-open"
            );

            menuToggle.textContent = "☰";

        }

    }
);


/* =======================================================
   SCROLL TO TOP BUTTON
======================================================== */
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


/* =======================================================
   DHRUVANTHEERA AI CHATBOT & FOUNDER CONCIERGE
======================================================== */
(function initDhruvantheeraChatbot() {
    const wrapper = document.getElementById("chatbotWrapper");
    const toggleBtn = document.getElementById("chatbotToggle");
    const teaser = document.getElementById("chatbotTeaser");
    const teaserClose = document.getElementById("teaserClose");
    const teaserTrigger = document.getElementById("teaserTrigger");
    const chatWindow = document.getElementById("chatbotWindow");
    const minBtn = document.getElementById("chatbotMinBtn");
    const chatMessages = document.getElementById("chatbotMessages");
    const chatForm = document.getElementById("chatbotForm");
    const chatInput = document.getElementById("chatbotInput");
    const chatChips = document.getElementById("chatbotChips");

    if (!wrapper || !toggleBtn || !chatWindow) return;

    let hasOpened = false;

    // Show animated greeting teaser bubble after delay
    setTimeout(() => {
        if (!hasOpened && teaser) {
            teaser.classList.remove("hide");
        }
    }, 2500);

    // Dismiss teaser
    if (teaserClose) {
        teaserClose.addEventListener("click", (e) => {
            e.stopPropagation();
            teaser.classList.add("hide");
        });
    }

    // Toggle Chat window
    function openChat() {
        hasOpened = true;
        wrapper.classList.add("open");
        chatWindow.removeAttribute("hidden");
        toggleBtn.setAttribute("aria-expanded", "true");
        if (teaser) teaser.classList.add("hide");

        if (chatMessages && chatMessages.children.length === 0) {
            sendWelcomeMessage();
        }

        setTimeout(() => {
            if (chatInput) chatInput.focus();
        }, 150);
    }

    function closeChat() {
        wrapper.classList.remove("open");
        chatWindow.setAttribute("hidden", "");
        toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", () => {
        if (wrapper.classList.contains("open")) {
            closeChat();
        } else {
            openChat();
        }
    });

    if (teaserTrigger) {
        teaserTrigger.addEventListener("click", openChat);
    }
    if (minBtn) {
        minBtn.addEventListener("click", closeChat);
    }

    // Format current time
    function getTimeStr() {
        const d = new Date();
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Scroll chat to bottom
    function scrollChatBottom() {
        const body = document.getElementById("chatbotBody");
        if (body) {
            body.scrollTop = body.scrollHeight;
        }
    }

    function escapeHTML(str) {
        const p = document.createElement("p");
        p.textContent = str;
        return p.innerHTML;
    }

    // Append user message
    function appendUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "chat-msg user";
        msgDiv.innerHTML = `
            <div class="chat-bubble">${escapeHTML(text)}</div>
            <span class="chat-msg-time">${getTimeStr()}</span>
        `;
        chatMessages.appendChild(msgDiv);
        scrollChatBottom();
    }

    // Append bot message with typing indicator
    function appendBotMessage(htmlContent, callback) {
        const typingDiv = document.createElement("div");
        typingDiv.className = "chat-msg bot typing-msg";
        typingDiv.innerHTML = `
            <div class="typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollChatBottom();

        setTimeout(() => {
            typingDiv.remove();
            const msgDiv = document.createElement("div");
            msgDiv.className = "chat-msg bot";
            msgDiv.innerHTML = `
                <div class="chat-bubble">${htmlContent}</div>
                <span class="chat-msg-time">${getTimeStr()}</span>
            `;
            chatMessages.appendChild(msgDiv);
            scrollChatBottom();
            if (callback) callback();
        }, 600);
    }

    // Founder Card HTML
    function getFounderCardHTML() {
        return `
            <div class="founder-card-chat">
                <div class="founder-card-hdr">
                    <div class="founder-avatar-wrap">
                        <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                        <div class="founder-role-tag">Founder & Managing Director</div>
                        <div class="founder-name">Dhruvantheera Constructions</div>
                    </div>
                </div>
                <div class="founder-details-list">
                    <div class="f-detail-item">
                        <i class="fa-solid fa-phone"></i>
                        <div>
                            <small>Direct Mobile</small>
                            <a href="tel:+917981227221">+91 79812 27221</a>
                        </div>
                    </div>
                    <div class="f-detail-item">
                        <i class="fa-brands fa-whatsapp"></i>
                        <div>
                            <small>WhatsApp</small>
                            <a href="https://wa.me/917981227221?text=Hi%2C%20I%20would%20like%20to%20connect%20with%20the%20Founder%20of%20Dhruvantheera%20Constructions." target="_blank" rel="noopener">+91 79812 27221</a>
                        </div>
                    </div>
                    <div class="f-detail-item">
                        <i class="fa-solid fa-envelope"></i>
                        <div>
                            <small>Official Email</small>
                            <a href="mailto:info@dhruvantheeraconstructions.com">info@dhruvantheeraconstructions.com</a>
                        </div>
                    </div>
                    <div class="f-detail-item">
                        <i class="fa-solid fa-location-dot"></i>
                        <div>
                            <small>Headquarters</small>
                            <span>Hyderabad, Telangana, India</span>
                        </div>
                    </div>
                </div>
                <div class="founder-action-btns">
                    <a href="https://wa.me/917981227221?text=Hi%2C%20I%20would%20like%20to%20connect%20with%20the%20Founder%20of%20Dhruvantheera%20Constructions." target="_blank" class="f-btn f-btn-wa">
                        <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp
                    </a>
                    <a href="tel:+917981227221" class="f-btn f-btn-call">
                        <i class="fa-solid fa-phone"></i> Call Direct
                    </a>
                    <a href="dhruvantheera-portfolio-refined.html" class="f-btn f-btn-portfolio">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i> Meet Founder & Portfolio
                    </a>
                </div>
            </div>
        `;
    }

    // Initial welcome message with Founder card
    function sendWelcomeMessage() {
        const welcomeHTML = `
            <p><strong>Namaste & Welcome to Dhruvantheera Constructions!</strong> 🏛️</p>
            <p style="margin-top: 6px;">I am your personal AI architectural concierge. I can assist you with <strong>project planning</strong>, <strong>turnkey construction</strong>, <strong>cost estimation</strong>, or connect you directly with our <strong>Founder & Managing Director</strong>.</p>
            ${getFounderCardHTML()}
            <p style="margin-top: 10px; font-size: 12px; color: rgba(255,255,255,0.7);">Select a topic below or type your question:</p>
        `;
        appendBotMessage(welcomeHTML);
    }

    // Knowledge / AI response resolver
    function getBotResponse(input) {
        const query = input.toLowerCase().trim();

        if (query.includes("founder") || query.includes("owner") || query.includes("director") || query.includes("who started") || query.includes("ceo") || query.includes("who is")) {
            return `
                <p><strong>About the Founder & Managing Director:</strong></p>
                <p style="margin-top: 6px;">The founder of <strong>Dhruvantheera Constructions</strong> leads every project with hands-on site execution, structural precision, and architectural excellence in Hyderabad.</p>
                ${getFounderCardHTML()}
            `;
        }

        if (query.includes("contact") || query.includes("phone") || query.includes("call") || query.includes("number") || query.includes("email") || query.includes("whatsapp")) {
            return `
                <p><strong>Direct Contact Information:</strong></p>
                <p style="margin: 6px 0;">You can reach our team and Founder directly:</p>
                ${getFounderCardHTML()}
            `;
        }

        if (query.includes("service") || query.includes("what do you do") || query.includes("residential") || query.includes("commercial") || query.includes("villa") || query.includes("interior")) {
            return `
                <p><strong>Our Core Construction Services:</strong></p>
                <ul style="margin: 8px 0 8px 18px; padding: 0; line-height: 1.6;">
                    <li><strong>Turnkey Luxury Villas & Homes:</strong> Complete end-to-end design and construction with zero quality compromise.</li>
                    <li><strong>Commercial Spaces & Complexes:</strong> Engineered for durability, modern functionality, and aesthetic presence.</li>
                    <li><strong>Architectural & Structural Design:</strong> 3D elevations, Vaastu compliance, and soil-tested engineering.</li>
                    <li><strong>Bespoke Interiors:</strong> Luxury woodwork, modular spaces, and refined finishes.</li>
                </ul>
                <div style="margin-top: 8px;">
                    <a href="#services" class="f-btn f-btn-call" style="display:inline-flex;">View Services on Page →</a>
                </div>
            `;
        }

        if (query.includes("cost") || query.includes("price") || query.includes("pricing") || query.includes("rate") || query.includes("sq ft") || query.includes("budget") || query.includes("estimate") || query.includes("calculator")) {
            return `
                <p><strong>Construction Pricing & Estimation:</strong></p>
                <p style="margin-top: 6px;">We follow a <strong>100% transparent milestone-based pricing model</strong> with no hidden costs and itemized Bills of Quantities (BOQ):</p>
                <ul style="margin: 8px 0 8px 18px; padding: 0; line-height: 1.6;">
                    <li><strong>Premium Structural Package:</strong> High-grade TMT 550D steel & certified concrete.</li>
                    <li><strong>Luxury Turnkey Package:</strong> Premium marble/vitrified tiles, designer sanitaryware, and electricals.</li>
                    <li><strong>Ultra-Luxury Bespoke Package:</strong> Custom Italian stone, smart home provisions, and custom woodwork.</li>
                </ul>
                <p style="margin-top: 6px;">Share your land size or architectural plans with the founder for an exact quote:</p>
                <div style="margin-top: 8px; display:flex; gap:6px;">
                    <a href="https://wa.me/917981227221?text=Hi%2C%20I%20would%20like%20a%20construction%20cost%20estimate%20for%20my%20property." target="_blank" class="f-btn f-btn-wa"><i class="fa-brands fa-whatsapp"></i> Get Quote on WhatsApp</a>
                </div>
            `;
        }

        if (query.includes("book") || query.includes("consultation") || query.includes("meeting") || query.includes("site visit") || query.includes("appointment")) {
            return `
                <p><strong>Schedule a Site Visit or Consultation:</strong></p>
                <p style="margin-top: 6px;">We would be delighted to inspect your site, review blueprints, or discuss your dream space in person.</p>
                <div style="margin-top: 10px; display:flex; flex-direction:column; gap:6px;">
                    <a href="Book.html" class="f-btn f-btn-call" style="background: var(--gold); color: #060f18;"><i class="fa-solid fa-calendar-check"></i> Open Booking Page</a>
                    <a href="https://wa.me/917981227221?text=Hi%20Dhruvantheera%20Team%2C%20I%20would%20like%20to%20book%20a%20site%20consultation." target="_blank" class="f-btn f-btn-wa"><i class="fa-brands fa-whatsapp"></i> Book via WhatsApp</a>
                </div>
            `;
        }

        if (query.includes("about") || query.includes("company") || query.includes("dhruvantheera") || query.includes("who are you")) {
            return `
                <p><strong>About DHRUVANTHEERA CONSTRUCTIONS:</strong></p>
                <p style="margin-top: 6px;">We are a premier Hyderabad-based construction and design firm dedicated to building spaces with <strong>precision engineering, unwavering trust, and timeless aesthetics</strong>.</p>
                <p style="margin-top: 6px;">Every project is delivered with a 10-year structural warranty, stage-by-stage quality audits, and clear communication.</p>
                <div style="margin-top: 8px;">
                    <a href="#about" class="f-btn f-btn-call" style="display:inline-flex;">Read Our Story →</a>
                </div>
            `;
        }

        if (query.includes("project") || query.includes("portfolio") || query.includes("work") || query.includes("gallery")) {
            return `
                <p><strong>Explore Our Work:</strong></p>
                <p style="margin-top: 6px;">Discover our completed and ongoing luxury residential villas, independent homes, and commercial projects across Hyderabad.</p>
                <div style="margin-top: 8px; display:flex; flex-direction:column; gap:6px;">
                    <a href="#projects" class="f-btn f-btn-call" style="display:inline-flex;">Explore Projects Section →</a>
                    <a href="dhruvantheera-portfolio-refined.html" class="f-btn f-btn-portfolio"><i class="fa-solid fa-images"></i> Founder Portfolio & Gallery</a>
                </div>
            `;
        }

        if (query.includes("location") || query.includes("office") || query.includes("where") || query.includes("hyderabad") || query.includes("address")) {
            return `
                <p><strong>Office Location:</strong></p>
                <p style="margin-top: 6px;">📍 <strong>Hyderabad, Telangana, India</strong></p>
                <p style="margin-top: 4px;">We undertake projects across Jubilee Hills, Banjara Hills, Gachibowli, Kokapet, Financial District, Manikonda, Kompally, and surrounding areas in Telangana.</p>
                <div style="margin-top: 8px;">
                    <a href="#contact" class="f-btn f-btn-call" style="display:inline-flex;">View Map on Page →</a>
                </div>
            `;
        }

        if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("namaste")) {
            return `
                <p>Hello! 👋 Great to connect with you. I am here to help you explore <strong>Dhruvantheera Constructions</strong>, get pricing estimations, or connect directly with our founder.</p>
                <p style="margin-top: 6px;">How can we assist you today?</p>
            `;
        }

        // Generic Intelligent Fallback
        return `
            <p>Thank you for asking! For specific requirements or detailed architectural discussions, you can connect directly with our <strong>Founder & Managing Director</strong>:</p>
            ${getFounderCardHTML()}
            <p style="margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.7);">You can also submit an enquiry through our website form and our team will get back to you promptly.</p>
        `;
    }

    // Handle form submit
    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            chatInput.value = "";
            appendUserMessage(text);

            const responseHTML = getBotResponse(text);
            appendBotMessage(responseHTML);
        });
    }

    // Handle Quick Action Chips
    if (chatChips) {
        chatChips.addEventListener("click", (e) => {
            const btn = e.target.closest(".chip-btn");
            if (!btn) return;
            const query = btn.getAttribute("data-query") || btn.textContent;
            appendUserMessage(btn.textContent);
            const responseHTML = getBotResponse(query);
            appendBotMessage(responseHTML);
        });
    }
})();
