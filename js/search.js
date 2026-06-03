/**
 * ELDERGO SEARCH COMPONENT (SMART PATH RESOLVER VERSION)
 * Include this single file in all your HTML/PHP pages using:
 * <script src="search.js" defer></script> 
 * (or <script src="../js/search.js" defer></script> from subfolders)
 */

(function() {
    
    // 1. CENTRALIZED DATA: Update your tours ONLY here!
    const mySearchData = [
        { title: 'Bali', url: 'international-tours/bali.php', subtitle: 'International Tour', keywords: 'asia, beach, tropical', trending: true },
        { title: 'Bhutan', url: 'international-tours/bhutan.php', subtitle: 'International Tour', keywords: 'asia, mountains, nature', trending: true },
        { title: 'Malaysia', url: 'international-tours/malaysia.php', subtitle: 'International Tour', keywords: 'asia, city, culture', trending: true },
        { title: 'Mauritius', url: 'international-tours/mauritius.php', subtitle: 'International Tour', keywords: 'africa, beach, island', trending: true },
    ];

    // --- SMART PATH RESOLVER ---
    // Automatically figures out if we need to add "../" depending on which page folder the user is in!
    function getRelativePrefix() {
        const path = window.location.pathname;
        const parts = path.replace(/^\/|\/$/g, '').split('/');
        
        // Count how many folders deep we are (subtract 1 for the actual file name)
        const depth = parts.length > 0 && parts[0] !== "" ? parts.length - 1 : 0;
        
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }
    
    const rootPrefix = getRelativePrefix();

    function upgradeExistingModal() {
        // 1. UPDATE TRENDING BUTTONS DYNAMICALLY
        const trendingContainer = document.querySelector('#search-recommendations .flex-wrap');
        if (trendingContainer) {
            const trendingHTML = mySearchData
                .filter(tour => tour.trending)
                .map((tour, index) => {
                    const styleClasses = index === 0 
                        ? "bg-purple-50 text-elder-primary border-purple-100 hover:bg-elder-primary hover:text-white" 
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-elder-primary hover:text-elder-primary hover:bg-purple-50";
                    return `<span onclick="fillSearch('${tour.title}')" class="px-3.5 md:px-4 py-1.5 md:py-2 ${styleClasses} border rounded-full text-sm md:text-[16px] font-medium transition-colors cursor-pointer shadow-sm min-h-[40px] flex items-center">${tour.title}</span>`;
                }).join('');
            trendingContainer.innerHTML = trendingHTML;
        }

        // 2. KILL THE OLD EVENT LISTENER AND ATTACH OURS
        const oldInput = document.getElementById('search-input');
        if (oldInput) {
            const newInput = oldInput.cloneNode(true);
            oldInput.parentNode.replaceChild(newInput, oldInput);
            newInput.addEventListener('input', (e) => executeSmartSearch(e.target.value));
        }
    }

    // 3. THE UPGRADED SEARCH ENGINE
    function executeSmartSearch(query) {
        const searchRecommendations = document.getElementById('search-recommendations');
        const searchResults = document.getElementById('search-results');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        
        const q = (query || '').toLowerCase().trim();

        if (q.length === 0) {
            if (searchRecommendations) searchRecommendations.classList.remove('hidden');
            if (searchResults) searchResults.classList.add('hidden');
            if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
            if (searchResults) searchResults.innerHTML = '';
            return;
        }

        if (clearSearchBtn) clearSearchBtn.classList.remove('hidden');
        if (searchRecommendations) searchRecommendations.classList.add('hidden');
        if (searchResults) searchResults.classList.remove('hidden');

        const filtered = mySearchData.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(q);
            const subtitleMatch = item.subtitle ? item.subtitle.toLowerCase().includes(q) : false;
            const keywordMatch = item.keywords ? item.keywords.toLowerCase().includes(q) : false;
            return titleMatch || subtitleMatch || keywordMatch;
        });

        if (filtered.length > 0) {
            let html = '<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-3xl mr-auto">';
            filtered.forEach(item => {
                
                // Safely combine the auto-calculated prefix with your URL
                const safeUrl = item.url.replace(/^\//, ''); // Removes accidental leading slashes
                const finalLink = rootPrefix + safeUrl;

                html += `
                    <a href="${finalLink}" class="flex items-center gap-4 p-4 hover:bg-purple-50 transition-colors border-b border-gray-50 last:border-0 group">
                        <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-elder-primary transition-colors">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="flex-1 text-left">
                            <h4 class="text-[16px] md:text-lg font-bold text-gray-900 group-hover:text-elder-primary transition-colors">${item.title}</h4>
                            <p class="text-[12px] md:text-sm text-gray-500">${item.subtitle}</p>
                        </div>
                        <i class="fas fa-chevron-right ml-auto text-gray-300 group-hover:text-elder-primary transition-colors text-sm"></i>
                    </a>
                `;
            });
            html += '</div>';
            if (searchResults) searchResults.innerHTML = html;
        } else {
            if (searchResults) searchResults.innerHTML = `
                <div class="text-center py-10 w-full max-w-3xl mr-auto bg-white rounded-2xl border border-gray-100">
                    <i class="fas fa-search text-4xl text-gray-200 mb-3"></i>
                    <h4 class="text-lg font-bold text-gray-900 mb-1">No tours found</h4>
                    <p class="text-gray-500">We couldn't find any tours matching "${query}"</p>
                </div>
            `;
        }
    }

    // 4. OVERRIDE HTML ONCLICK FUNCTIONS
    window.toggleSearchModal = function() {
        const searchModal = document.getElementById('search-modal');
        const searchInput = document.getElementById('search-input');
        
        if (searchModal) {
            searchModal.classList.toggle('open');
            if(searchModal.classList.contains('open')) {
                window.clearSearch();
                setTimeout(() => searchInput && searchInput.focus(), 100);
            }
        }
    };

    window.clearSearch = function() {
        const searchInput = document.getElementById('search-input');
        const searchRecommendations = document.getElementById('search-recommendations');
        const searchResults = document.getElementById('search-results');
        const clearSearchBtn = document.getElementById('clear-search-btn');

        if (searchInput) searchInput.value = '';
        if (searchRecommendations) searchRecommendations.classList.remove('hidden');
        if (searchResults) searchResults.classList.add('hidden');
        if (clearSearchBtn) clearSearchBtn.classList.add('hidden');
        if (searchResults) searchResults.innerHTML = '';
        if (searchInput) searchInput.focus();
    };

    window.fillSearch = function(term) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = term;
        executeSmartSearch(term);
    };

    // 5. RUN THE UPGRADE WHEN PAGE LOADS
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', upgradeExistingModal);
    } else {
        upgradeExistingModal();
    }

    window.addEventListener('load', function() {
        window.fillSearch = function(term) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = term;
            executeSmartSearch(term);
        };
    });

})();