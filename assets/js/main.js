(function () {
  "use strict";

  const body = document.body;
  const header = document.querySelector("#header");
  const headerToggle = document.querySelector(".header-toggle");
  const navLinks = document.querySelectorAll("#navmenu a");
  const scrollTop = document.querySelector("#scroll-top");
  const progressBar = document.querySelector(".scroll-progress");
  const cursorGlow = document.querySelector(".cursor-glow");

  function initializeWelcome() {
    const welcome = document.querySelector("#welcome-screen");
    const percent = document.querySelector("#welcome-percent");
    const loader = document.querySelector(".welcome-loader-line");

    if (!welcome) {
      body.classList.remove("welcome-active");
      return;
    }

    body.classList.add("welcome-active");

    let progress = 0;

    const progressTimer = setInterval(function () {
      progress += Math.floor(Math.random() * 5) + 2;

      if (progress > 100) {
        progress = 100;
      }

      if (percent) {
        percent.textContent = progress + "%";
      }

      if (loader) {
        loader.style.width = progress + "%";
      }

      if (progress >= 100) {
        clearInterval(progressTimer);
      }
    }, 90);

    setTimeout(function () {
      welcome.classList.add("hide");
      body.classList.remove("welcome-active");

      setTimeout(function () {
        welcome.remove();
      }, 1100);
    }, 5000);
  }

  initializeWelcome();

  function toggleMobileHeader() {
    if (!header || !headerToggle) {
      return;
    }

    header.classList.toggle("header-show");

    headerToggle.classList.toggle("bi-list");
    headerToggle.classList.toggle("bi-x");
  }

  if (headerToggle) {
    headerToggle.addEventListener("click", toggleMobileHeader);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (header && header.classList.contains("header-show")) {
        toggleMobileHeader();
      }
    });
  });

  function updateScrollUI() {
    const scrollPosition = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (progressBar && documentHeight > 0) {
      progressBar.style.width = Math.min((scrollPosition / documentHeight) * 100, 100) + "%";
    }

    if (scrollTop) {
      if (scrollPosition > 500) {
        scrollTop.classList.add("active");
      } else {
        scrollTop.classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  window.addEventListener("load", updateScrollUI);

  if (scrollTop) {
    scrollTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  function initializeAOS() {
    if (typeof AOS === "undefined") {
      return;
    }

    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 70
    });
  }

  window.addEventListener("load", initializeAOS);

  function initializeTyped() {
    const typedElement = document.querySelector(".typed");

    if (!typedElement || typeof Typed === "undefined") {
      return;
    }

    const strings = typedElement
      .getAttribute("data-typed-items")
      .split(",")
      .map(function (item) {
        return item.trim();
      });

    new Typed(".typed", {
      strings: strings,
      loop: true,
      typeSpeed: 65,
      backSpeed: 35,
      backDelay: 1800,
      smartBackspace: true,
      showCursor: true
    });
  }

  window.addEventListener("load", initializeTyped);

  function initializeCounter() {
    if (typeof PureCounter === "undefined") {
      return;
    }

    new PureCounter();
  }

  window.addEventListener("load", initializeCounter);

  function initializeLightbox() {
    if (typeof GLightbox === "undefined") {
      return;
    }

    GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: true,
      zoomable: true,
      draggable: true
    });
  }

  window.addEventListener("load", initializeLightbox);

  function initializeSwiper() {
    if (typeof Swiper === "undefined") {
      return;
    }

    document.querySelectorAll(".init-swiper").forEach(function (element) {
      const configElement = element.querySelector(".swiper-config");

      if (!configElement) {
        return;
      }

      let config = {};

      try {
        config = JSON.parse(configElement.textContent.trim());
      } catch (error) {
        return;
      }

      new Swiper(element, config);
    });
  }

  window.addEventListener("load", initializeSwiper);

  function initializeProjectFilters() {
    const filters = document.querySelectorAll(".project-filter");
    const projects = document.querySelectorAll(".project-card");
    const countElement = document.querySelector("#visible-project-count");

    if (!filters.length || !projects.length) {
      return;
    }

    function updateProjectCount(selectedCategory) {
      let visibleCount = 0;

      projects.forEach(function (project) {
        const categories = project.getAttribute("data-category") || "";
        const matches =
          selectedCategory === "all" ||
          categories.split(" ").includes(selectedCategory);

        if (matches) {
          visibleCount += 1;
        }
      });

      if (countElement) {
        countElement.textContent = visibleCount;
      }
    }

    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        filters.forEach(function (button) {
          button.classList.remove("active");
          button.setAttribute("aria-selected", "false");
        });

        filter.classList.add("active");
        filter.setAttribute("aria-selected", "true");

        const selectedCategory = filter.getAttribute("data-filter");

        projects.forEach(function (project, index) {
          const categories = project.getAttribute("data-category") || "";
          const matches =
            selectedCategory === "all" ||
            categories.split(" ").includes(selectedCategory);

          if (matches) {
            project.classList.remove("hidden");
            project.style.setProperty("--filter-index", index);
          } else {
            project.classList.add("hidden");
          }
        });

        updateProjectCount(selectedCategory);

        if (typeof AOS !== "undefined") {
          AOS.refreshHard();
        }
      });

      filter.setAttribute("aria-selected", filter.classList.contains("active") ? "true" : "false");
    });

    updateProjectCount("all");
  }

  initializeProjectFilters();

  function initializeScrollSpy() {
    const sections = document.querySelectorAll("main section[id]");
    const menuLinks = document.querySelectorAll("#navmenu a[href^='#']");

    function updateActiveNavigation() {
      const scrollPosition = window.scrollY + 250;
      let activeSection = "";

      sections.forEach(function (section) {
        if (
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          activeSection = section.id;
        }
      });

      if (window.scrollY < 300) {
        activeSection = "hero";
      }

      menuLinks.forEach(function (link) {
        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + activeSection) {
          link.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
      passive: true
    });

    window.addEventListener("load", updateActiveNavigation);
  }

  initializeScrollSpy();

  function initializeCursorGlow() {
    if (!cursorGlow || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    document.addEventListener("mousemove", function (event) {
      cursorGlow.style.left = event.clientX + "px";
      cursorGlow.style.top = event.clientY + "px";
      cursorGlow.style.opacity = "1";
    });

    document.addEventListener("mouseleave", function () {
      cursorGlow.style.opacity = "0";
    });
  }

  initializeCursorGlow();

  function initializeHeroParallax() {
    const heroVisual = document.querySelector(".hero-visual");

    if (!heroVisual || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    heroVisual.addEventListener("mousemove", function (event) {
      const rect = heroVisual.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 8;
      const rotateX = ((y / rect.height) - 0.5) * -8;

      heroVisual.style.transform =
        "perspective(1000px) rotateX(" +
        rotateX +
        "deg) rotateY(" +
        rotateY +
        "deg)";
    });

    heroVisual.addEventListener("mouseleave", function () {
      heroVisual.style.transform = "";
    });
  }

  initializeHeroParallax();

  function initializeCardTilt() {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const cards = document.querySelectorAll(
      ".ai-skill-card, .service-card, .project-card"
    );

    cards.forEach(function (card) {
      card.addEventListener("mousemove", function (event) {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateX = ((y / rect.height) - 0.5) * -3;
        const rotateY = ((x / rect.width) - 0.5) * 3;

        card.style.transform =
          "perspective(800px) rotateX(" +
          rotateX +
          "deg) rotateY(" +
          rotateY +
          "deg) translateY(-5px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  initializeCardTilt();

  function initializeForm() {
    const form = document.querySelector("#contact-form");
    const status = document.querySelector("#form-status");

    if (!form || !status) {
      return;
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalContent = button.innerHTML;

      button.disabled = true;
      button.innerHTML =
        "<span>Sending...</span><i class='bi bi-arrow-repeat'></i>";

      status.textContent = "";
      status.className = "form-status";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {
          form.reset();
          status.textContent =
            "Message sent successfully. I'll get back to you soon.";
          status.classList.add("success");
        } else {
          status.textContent =
            "Something went wrong. Please email me directly.";
          status.classList.add("error");
        }
      } catch (error) {
        status.textContent =
          "Unable to send right now. Please email me directly.";
        status.classList.add("error");
      }

      button.disabled = false;
      button.innerHTML = originalContent;
    });
  }

  initializeForm();

  function initializeSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  initializeSmoothAnchors();

  function initializeImageFallbacks() {
    document.querySelectorAll("img").forEach(function (image) {
      image.addEventListener("error", function () {
        image.style.opacity = "0.25";
      });
    });
  }

  initializeImageFallbacks();

  window.addEventListener("load", function () {
    const preloader = document.querySelector("#preloader");

    if (!preloader) {
      return;
    }

    setTimeout(function () {
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";

      setTimeout(function () {
        preloader.remove();
      }, 600);
    }, 350);
  });

  function initializeInteractionPolish() {
    const interactiveElements = document.querySelectorAll(
      ".hero-btn, .project-filter, .project-link, .project-icon, .contact-method, .social-links a"
    );

    interactiveElements.forEach(function (element) {
      element.addEventListener("pointerdown", function () {
        element.classList.add("is-pressed");
      });

      ["pointerup", "pointercancel", "pointerleave"].forEach(function (eventName) {
        element.addEventListener(eventName, function () {
          element.classList.remove("is-pressed");
        });
      });
    });

    document.querySelectorAll(".project-card").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        card.classList.add("is-hovered");
      });

      card.addEventListener("mouseleave", function () {
        card.classList.remove("is-hovered");
      });
    });
  }

  initializeInteractionPolish();

})();

/* =========================================================
   MOBILE QUICK ACCESS NAVIGATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  const quickNav = document.querySelector(".mobile-quick-nav");
  const quickNavItems = document.querySelectorAll(".quick-nav-item");

  if (!quickNav || !quickNavItems.length) {
    return;
  }


  /* ---------------------------------------------------------
     SHOW QUICK NAV AFTER USER STARTS SCROLLING
     --------------------------------------------------------- */

  function updateQuickNavVisibility() {

    if (window.scrollY > 180) {
      quickNav.classList.add("visible");
    } else {
      quickNav.classList.remove("visible");
    }

  }


  window.addEventListener(
    "scroll",
    updateQuickNavVisibility,
    { passive: true }
  );


  updateQuickNavVisibility();


  /* ---------------------------------------------------------
     SMOOTH SECTION NAVIGATION
     --------------------------------------------------------- */

  quickNavItems.forEach(function (item) {

    item.addEventListener("click", function (event) {

      event.preventDefault();

      const targetId = this.getAttribute("href");

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      const headerOffset = 20;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

    });

  });


  /* ---------------------------------------------------------
     UPDATE ACTIVE ICON WHILE SCROLLING
     --------------------------------------------------------- */

  const sections = [
    "hero",
    "about",
    "skills",
    "resume",
    "portfolio",
    "services",
    "testimonials",
    "contact"
  ];


  function updateActiveQuickNav() {

    const scrollPosition =
      window.scrollY + (window.innerHeight * 0.35);


    let currentSection = "hero";


    sections.forEach(function (sectionId) {

      const section =
        document.getElementById(sectionId);

      if (!section) {
        return;
      }


      const sectionTop =
        section.offsetTop;

      if (scrollPosition >= sectionTop) {
        currentSection = sectionId;
      }

    });


    quickNavItems.forEach(function (item) {

      const sectionId =
        item.getAttribute("data-section");

      item.classList.toggle(
        "active",
        sectionId === currentSection
      );

    });

  }


  window.addEventListener(
    "scroll",
    updateActiveQuickNav,
    { passive: true }
  );


  updateActiveQuickNav();

});
