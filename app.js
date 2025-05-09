// Main app JavaScript to handle SPA navigation

// Function to toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('active');
}

// Define openMonth function globally for meeting page
window.openMonth = function (monthName) {
  // Masquer tout le contenu des onglets
  var tabContents = document.getElementsByClassName('calendar-tab-content');
  for (var i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove('active');
  }

  // Désactiver tous les boutons d'onglets
  var tabButtons = document.getElementsByClassName('tab-button');
  for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove('active');
  }

  // Afficher l'onglet sélectionné et activer son bouton
  document.getElementById(monthName).classList.add('active');

  // Trouver et activer le bouton correspondant
  var buttons = document.querySelectorAll('.tab-button');
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].textContent.toLowerCase().includes(monthName)) {
      buttons[i].classList.add('active');
      break;
    }
  }
};

// Function to dynamically load Email.js library
function loadEmailJSLibrary() {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.emailjs) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Email.js library'));
    document.head.appendChild(script);
  });
}

// Email.js form handling functionality
function initEmailJS() {
  // First load the Email.js library if it's not already loaded
  loadEmailJSLibrary()
    .then(() => {
      // Initialize EmailJS
      // Replace with your own Email.js public key and service/template IDs
      emailjs.init('YOUR_PUBLIC_KEY');

      const contactForm = document.getElementById('contact-form');
      const submitBtn = document.getElementById('submit-btn');
      const formStatus = document.getElementById('form-status');

      if (contactForm) {
        // Remove any existing event listeners (to avoid duplicates)
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        // Get fresh references
        const freshForm = document.getElementById('contact-form');
        const freshBtn = document.getElementById('submit-btn');
        const freshStatus = document.getElementById('form-status');

        freshForm.addEventListener('submit', function (event) {
          event.preventDefault();

          // Set button to loading state
          freshBtn.disabled = true;
          freshBtn.innerText = 'Envoi en cours...';

          // Prepare template parameters
          const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
          };

          // Send the email using Email.js
          // Replace service_id and template_id with your actual Email.js IDs
          emailjs.send('SERVICE_ID', 'TEMPLATE_ID', templateParams).then(
            function (response) {
              console.log('SUCCESS!', response.status, response.text);

              // Show success message
              freshStatus.innerText =
                'Votre message a été envoyé avec succès. Je vous répondrai dans les meilleurs délais.';
              freshStatus.className = 'form-status success';

              // Reset form
              freshForm.reset();

              // Reset button
              freshBtn.disabled = false;
              freshBtn.innerText = 'Envoyer';
            },
            function (error) {
              console.log('FAILED...', error);

              // Show error message
              freshStatus.innerText =
                "Une erreur s'est produite lors de l'envoi de votre message. Veuillez réessayer ultérieurement.";
              freshStatus.className = 'form-status error';

              // Reset button
              freshBtn.disabled = false;
              freshBtn.innerText = 'Envoyer';
            }
          );
        });
      }
    })
    .catch(error => {
      console.error('Failed to initialize Email.js:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Handle navigation
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      loadContent(page);

      // Update active state in navigation
      navLinks.forEach(link => link.classList.remove('active'));
      this.classList.add('active');

      // Update browser URL without reload
      history.pushState({ page: page }, null, page === 'home' ? '/' : page + '.html');

      // Hide mobile menu if it's open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });

  // Handle browser navigation (back/forward)
  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.page) {
      loadContent(e.state.page);

      // Update active state in navigation
      navLinks.forEach(link => link.classList.remove('active'));
      document.querySelector(`nav a[data-page="${e.state.page}"]`).classList.add('active');
    }
  });

  // Initial content based on URL
  const path = window.location.pathname;
  let currentPage = 'home'; // Default

  // Normalize the path to extract the page name
  const normalizedPath =
    path === '/' || path === '/index.html' ? 'home' : path.replace(/^\/|\.html$/g, '');
  currentPage = normalizedPath || 'home';

  // Set active navigation item
  navLinks.forEach(link => link.classList.remove('active'));
  const navLink = document.querySelector(`nav a[data-page="${currentPage}"]`);
  if (navLink) {
    navLink.classList.add('active');
  } else {
    // Fallback to home if the page isn't found in navigation
    currentPage = 'home';
    document.querySelector(`nav a[data-page="home"]`).classList.add('active');
  }

  // Load initial content
  loadContent(currentPage);

  // Store initial state
  history.replaceState({ page: currentPage }, null);

  // Function to load content into the main container
  async function loadContent(page) {
    const contentArea = document.getElementById('main-content');
    contentArea.innerHTML = '<div class="loading">Chargement...</div>';

    try {
      const response = await fetch(`${page}.html`);

      if (!response.ok) {
        throw new Error('Content not found');
      }

      const html = await response.text();
      contentArea.innerHTML = html;

      // Execute any scripts in the loaded content
      const scripts = contentArea.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        eval(scripts[i].innerText);
      }

      // Initialize Email.js if the contact page is loaded
      if (page === 'contact') {
        initEmailJS();
      }

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      contentArea.innerHTML = `
        <div class="error-message">
          <h2>Contenu non disponible</h2>
          <p>Le contenu demandé n'a pas pu être chargé.</p>
        </div>
      `;
      console.error('Error loading content:', error);
    }
  }

  // Script for header scroll behavior
  window.addEventListener('scroll', function () {
    const header = document.getElementById('site-header');
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    // Calculate half viewport height
    const halfViewport = windowHeight / 2;

    // If scrolling past half viewport, hide header
    if (scrollY > halfViewport) {
      header.classList.add('hidden');
    } else {
      // Otherwise, show it
      header.classList.remove('hidden');
    }
  });

  (function () {
    function initializeAccordion() {
      const accordionHeaders = document.querySelectorAll('.accordion-header');
      accordionHeaders.forEach(header => {
        header.addEventListener('click', function () {
          this.classList.toggle('active');
          const content = this.nextElementSibling;
          if (this.classList.contains('active')) {
            content.style.maxHeight = content.scrollHeight + 'px';
          } else {
            content.style.maxHeight = 0;
          }
        });
      });
    }

    // Observe changes to the DOM
    const observer = new MutationObserver(mutations => {
      if (document.querySelector('.info-accordion')) {
        initializeAccordion();
        observer.disconnect(); // Stop observing once initialized
      }
    });

    // Start observing the document body
    observer.observe(document.body, { childList: true, subtree: true });
  })();
});
