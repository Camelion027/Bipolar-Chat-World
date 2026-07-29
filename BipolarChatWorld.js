async function callMyAI() {
  try {
    // Calls your secure backend route instead of Google directly
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: "Hello! Give me a quick greeting." })
    });

    const data = await response.json();
    console.log("Full API Response:", data);

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (reply) {
      console.log("AI says:", reply);
    } else {
      console.error("The response structure was unexpected.");
    }

  } catch (error) {
    console.error("Network or fetch error:", error);
  }
}

callMyAI();



/**
 * BipolarChatWorld.js
 * Handles data fetching, searching, and UI rendering.
 */

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
    fetch('/BipolarChatWorld.json')
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
                <img src="https://flagcdn.com/w160/${res.countryCode.toLowerCase()}.png" class="flag-img" alt="${res.country}">
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