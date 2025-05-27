function checkPageRedirection() {
  const path = window.location.pathname;

  // Skip the check for these special cases to avoid infinite loops
  // 1. Root URL (/)
  // 2. URLs that end with / (directory index)
  // 3. URLs that already point to index.html
  if (path === '/' || path === '' || path.endsWith('/') || path.includes('index')) {
    return;
  }

  // Only redirect if the current page doesn't have the main-content element
  if (!document.getElementById('main-content')) {
    // Redirect to home page
    window.location.href = '/index.html';
  }
}

// Run the check when the page loads
window.addEventListener('load', checkPageRedirection);

// Check when URL hash changes (when navigating between sections with #)
window.addEventListener('hashchange', checkPageRedirection);

// Check when navigating with browser history (back/forward buttons)
window.addEventListener('popstate', checkPageRedirection);

// Also set a periodic check for any other URL changes
let lastUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    checkPageRedirection();
  }
}, 500);
