/**
 * BipolarChatWorld.js
 * Handles data fetching, searching, UI rendering, and global initializations.
 */

// 1. Initialize Google Analytics configuration safely
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-061EEZXPWG');

// 2. Handle scroll restoration immediately
window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('results-area');
    const searchInput = document.getElementById('searchInput');

    if (!grid || !searchInput) return;

    // Search aliases for better user experience
    const aliases = {
        'uk': 'great britain', 
        'u.k.': 'great britain',
        'usa': 'united states', 
        'u.s.': 'united states'
    };
    
    let resources = [];
    
    // Fetch JSON data from the same directory
    fetch('BipolarChatWorld.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load JSON');
            return response.json();
        })
        .then(data => {
            resources = data.resources;
            renderCards(resources);

            // Search filtering logic
            searchInput.addEventListener('input', () => {
                const filter = searchInput.value.toLowerCase().trim();
                const filtered = resources.filter(res => {
                    const country = res.country.toLowerCase();
                    return country.startsWith(filter) || (aliases[filter] && country.startsWith(aliases[filter]));
                });

                renderCards(filtered.length === 0 && filter !== '' ? [] : filtered);
            });
        })
        .catch(error => console.error('BipolarChatWorld Error:', error));

    // Function to render cards dynamically
    function renderCards(list) {
        grid.innerHTML = list.length === 0 ? '<div class="no-results-msg">NOTHING FOUND</div>' : '';
        
        list.forEach(res => {
            const card = document.createElement('a');
            card.href = res.url;
            card.target = "_blank";
            card.rel = "noopener noreferrer"; // Security best practice
            card.className = 'flag-card';
            
            // Transform the organization name to uppercase
            let orgName = res.name;
            let uppercaseOrgName = orgName.toUpperCase();
            
            card.innerHTML = `
                <img src="https://images.weserv.nl/?url=flagcdn.com/w160/${res.countryCode.toLowerCase()}.png" class="flag-img" crossorigin="anonymous" alt="${res.country}">
                <div class="org-name">${uppercaseOrgName}</div>
                <div class="country-sub">${res.country}</div>
            `;
            grid.appendChild(card);
        });
    }
});

// Focus the search bar when the page loads
window.onload = function() {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.focus();
};

// Global safety net to prevent dragging images or cards
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
}, false);

// Prevent default scrolling and tab behavior for specific navigation keys
window.addEventListener('keydown', (e) => {
    const keysToBlock = ['PageDown', 'PageUp', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
    
    // Check if the pressed key is in our blocklist
    if (keysToBlock.includes(e.key)) {
        // Allow typing spaces or using arrows inside the search input if needed, 
        // but block it everywhere else (or block it completely if you want total lockdown)
        e.preventDefault();
    }
});