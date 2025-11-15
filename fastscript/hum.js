 // Hamburger toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("show");
    hamburger.classList.toggle("open");

    if (isOpen) {
      // Push dummy state so back button can close menu
      history.pushState({ menu: true }, "");
    }
  });

  // Handle back button to close hamburger menu
  window.addEventListener("popstate", (event) => {
    if (navMenu.classList.contains("show")) {
      navMenu.classList.remove("show");
      hamburger.classList.remove("open");
    }
  });
