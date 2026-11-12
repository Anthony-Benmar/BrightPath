// Shared navigation, scroll reveals, review controls, and local form feedback.
document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  // Keep the mobile menu's visual and accessible states in sync.
  if (menuButton && navigation) {
    const closeMenu = () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
      navigation.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Framer-style fade and rise as sections enter view; content stays visible without motion support.
  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Keep the reviews draggable on touch and provide arrow controls on larger screens.
  const reviewTrack = document.querySelector("[data-review-track]");
  const firstReview = reviewTrack?.querySelector(".review-card");
  const previousReview = document.querySelector("[data-slider-prev]");
  const nextReview = document.querySelector("[data-slider-next]");
  if (reviewTrack && firstReview && previousReview && nextReview) {
    const getStep = () => firstReview.getBoundingClientRect().width + 24;
    previousReview.addEventListener("click", () => reviewTrack.scrollBy({ left: -getStep(), behavior: "smooth" }));
    nextReview.addEventListener("click", () => reviewTrack.scrollBy({ left: getStep(), behavior: "smooth" }));
  }

  // The contact form is a prototype: validate it and explain that no data is transmitted.
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm instanceof HTMLFormElement) {
    const status = contactForm.querySelector(".form-status");
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      if (status) status.textContent = "Thanks. Your request is ready; connect a form service to receive it.";
      contactForm.reset();
    });
  }

  // Newsletter submission is also local-only until an email provider is connected.
  document.querySelectorAll("[data-newsletter]").forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const status = form.querySelector(".newsletter-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      if (status) status.textContent = "Demo only — no subscription was sent.";
      form.reset();
    });
  });

  document.querySelectorAll("[data-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });
});
