// Main app JavaScript to handle SPA navigation

// Function to toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('active');
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
  const normalizedPath = path === '/' || path === '/index.html' ? 'home' : path.replace(/^\/|\.html$/g, '');
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

  // Function to load content from files
  function loadContent(page) {
    const contentArea = document.getElementById('main-content');
    contentArea.innerHTML = '<div class="loading">Chargement...</div>';

    fetch(`${page}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Content not found');
        }
        return response.text();
      })
      .then(html => {
        contentArea.innerHTML = html;
        // Execute any scripts in the loaded content
        const scripts = contentArea.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          eval(scripts[i].innerText);
        }

        // Scroll to top
        window.scrollTo(0, 0);
      })
      .catch(error => {
        contentArea.innerHTML = `
                <div class="error-message">
                    <h2>Contenu non disponible</h2>
                    <p>Le contenu demandé n'a pas pu être chargé.</p>
                </div>
            `;
        console.error('Error loading content:', error);
      });
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
