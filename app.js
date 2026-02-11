// Telcomet Website – Client-side Interactions
// Lightweight enhancements on top of Tailwind & Alpine.

(function () {
  const header = document.getElementById("site-header");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return null;
      const id = href.slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  // Toggle header shadow + background on scroll
  function handleScroll() {
    if (!header) return;
    const threshold = 40;
    if (window.scrollY > threshold) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }

  // Simple scrollspy using IntersectionObserver
  function setupScrollSpy() {
    if (!("IntersectionObserver" in window) || sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = navLinks.find((l) => l.getAttribute("href") === `#${id}`);
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("is-active"));
            link.classList.add("is-active");
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // Contact form validation and UX (no backend – this is a front-end demo)
  function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const successMessage = document.getElementById("form-success");

    function showError(fieldName, message) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const error = form.querySelector(`[data-error-for="${fieldName}"]`);
      if (!field || !error) return;
      field.classList.add("field-error");
      error.textContent = message;
      error.classList.remove("hidden");
    }

    function clearError(fieldName) {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const error = form.querySelector(`[data-error-for="${fieldName}"]`);
      if (!field || !error) return;
      field.classList.remove("field-error");
      error.classList.add("hidden");
    }

    function validateEmail(value) {
      // Simple but effective email pattern
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const fullName = form.fullName.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const consent = form.consent.checked;

      let valid = true;

      clearError("fullName");
      clearError("email");
      clearError("message");
      clearError("consent");

      if (!fullName) {
        showError("fullName", "Please enter your name.");
        valid = false;
      }

      if (!email || !validateEmail(email)) {
        showError("email", "Please enter a valid email address.");
        valid = false;
      }

      if (!message) {
        showError(
          "message",
          "Please add a short description so we can route this to the right team."
        );
        valid = false;
      }

      if (!consent) {
        showError("consent", "Please confirm consent so we can respond to your enquiry.");
        valid = false;
      }

      if (!valid) {
        return;
      }

      // Simulate successful submission (front-end only)
      if (successMessage) {
        successMessage.classList.remove("hidden");
      }

      // In a real implementation this is where we'd send data to an API.
      form.reset();
    });

    // Clear error state on input
    ["fullName", "email", "message", "consent"].forEach((fieldName) => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      if (!field) return;
      const eventType = fieldName === "consent" ? "change" : "input";
      field.addEventListener(eventType, () => clearError(fieldName));
    });
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  setupScrollSpy();
  setupContactForm();
})();

