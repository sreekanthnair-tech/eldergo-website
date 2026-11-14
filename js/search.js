/**
 * ELDERGO SEARCH COMPONENT (SINGLE SOURCE OF TRUTH)
 * Include this single file on every page that has the search modal:
 *   <script src="/js/search.js" defer></script>
 * The leading slash makes it root-relative, so it loads correctly at any folder depth.
 *
 * This file owns the search index, the trending chips, and all search behaviour.
 * Do NOT keep a separate inline `searchData` on the pages — update tours ONLY here.
 */

(function() {

    // 1. CENTRALIZED DATA — update your tours ONLY here.
    //    URLs are ROOT-RELATIVE (leading "/") so they resolve the same from any page depth.
    const mySearchData = [
        { title: 'Bali',                         url: '/international-tours.html',           subtitle: 'International Tours', keywords: 'asia, beach, temples, tropical, indonesia', trending: false },
        { title: 'Sri Lanka',                    url: '/international-tours/srilanka.html',  subtitle: 'International Tour', keywords: 'asia, beach, temples, tea, island, sigiriya, kandy, colombo, nuwara eliya, ramayana', trending: true },
        { title: 'Thailand',                     url: '/international-tours.html',           subtitle: 'International Tour', keywords: 'asia, beach, islands, palaces, temples', trending: true },
        { title: 'Vietnam',                      url: '/international-tours.html',           subtitle: 'International Tour', keywords: 'asia, bay, old town, nature, culture' },
        { title: 'Singapore + Malaysia',         url: '/international-tours.html',           subtitle: 'International Tour', keywords: 'asia, city, gardens, culture' },
        { title: 'China',                        url: '/international-tours.html',           subtitle: 'International Tour', keywords: 'asia, great wall, history, heritage' },
        { title: 'Andaman',                      url: '/domestic-tours/andaman.html',       subtitle: 'Domestic Tour',     keywords: 'india, beach, islands, sea, tropical, port blair, havelock, cellular jail, radhanagar, scuba', trending: true },
        { title: 'Meghalaya',                    url: '/domestic-tours.html',               subtitle: 'Domestic Tour',     keywords: 'india, hills, waterfalls, nature, northeast', trending: true },
        { title: 'Rajasthan',                    url: '/domestic-tours/rajasthan.html',     subtitle: 'Domestic Tour',     keywords: 'india, desert, forts, palaces, heritage, udaipur, jodhpur, jaisalmer, sam dunes, camel, bikaner, mandawa, jaipur, amber fort, hawa mahal' },
        { title: 'Coorg',                        url: '/weekend-getaways.html',             subtitle: 'Weekend Getaway',   keywords: 'india, coffee, hills, nature, karnataka' },
        { title: 'Hampi',                        url: '/weekend-getaways.html',             subtitle: 'Weekend Getaway',   keywords: 'india, heritage, ruins, history, karnataka' },
        { title: 'Divine Kashi & Prayagraj',     url: '/spiritual-journeys.html',           subtitle: 'Spiritual Journey', keywords: 'india, temple, ganga, varanasi, pilgrimage' },
        { title: 'Sacred Rameshwaram & Madurai', url: '/spiritual-journeys.html',           subtitle: 'Spiritual Journey', keywords: 'india, temple, south, pilgrimage, yatra' },
    ];

    function upgradeExistingModal() {
        // 1. RENDER TRENDING CHIPS FROM THE INDEX (single source)
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

        // 2. REMOVE ANY EXISTING LISTENER AND ATTACH OURS
        const oldInput = document.getElementById('search-input');
        if (oldInput) {
            const newInput = oldInput.cloneNode(true);
            oldInput.parentNode.replaceChild(newInput, oldInput);
            newInput.addEventListener('input', (e) => executeSmartSearch(e.target.value));
        }
    }

    // 2. THE SEARCH ENGINE
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
                // URLs are root-relative already — use them directly (no path math, depth-proof).
                const finalLink = item.url;
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

    // 3. GLOBAL FUNCTIONS USED BY HTML onclick ATTRIBUTES
    window.toggleSearchModal = function() {
        const searchModal = document.getElementById('search-modal');
        const searchInput = document.getElementById('search-input');
        if (searchModal) {
            searchModal.classList.toggle('open');
            searchModal.classList.toggle('invisible');
            if (searchModal.classList.contains('open') && !searchModal.classList.contains('invisible')) {
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

    // 4. INIT
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', upgradeExistingModal);
    } else {
        upgradeExistingModal();
    }

})();

/**
 * ELDERGO PHONE CHECK (SINGLE SOURCE OF TRUTH for every lead form)
 * Blocks bad phone numbers BEFORE a form posts to web-lead-intake
 * (an 8-digit number got through on 4 Nov and TeleCRM rejected the lead).
 * Rule: strip spaces, dashes, brackets. OK = 10 digits starting 6-9, optionally
 * with +91 / 91 / 0 in front; OR an international number: + then 8-15 digits.
 * Covers: .waitlist-form, .contact-form, #egq-form, and any form whose action is web-lead-intake.
 */
(function() {
    // PHONE-RULE-START
    function egValidPhone(v) {
        var s = String(v == null ? '' : v).replace(/[\s\-()\[\]]/g, '');
        if (/^(\+91|91|0)?[6-9]\d{9}$/.test(s)) return true;
        if (/^\+91/.test(s)) return false;
        return /^\+\d{8,15}$/.test(s);
    }
    // PHONE-RULE-END
    window.egValidPhone = egValidPhone;

    var PHONE_MSG = 'Please enter a 10-digit mobile number';

    function isLeadForm(form) {
        if (!form || form.tagName !== 'FORM') return false;
        if (form.matches('.waitlist-form, .contact-form, #egq-form')) return true;
        var a = form.getAttribute('action') || '';
        return a.indexOf('web-lead-intake') !== -1;
    }

    function errEl(input) {
        var n = input.nextElementSibling;
        if (n && n.classList.contains('eg-phone-err')) return n;
        n = document.createElement('p');
        n.className = 'eg-phone-err';
        n.setAttribute('role', 'alert');
        n.style.cssText = 'color:#dc2626;font-size:13px;font-weight:600;margin:4px 0 0;text-align:left;';
        input.insertAdjacentElement('afterend', n);
        return n;
    }

    // Capture phase: runs before each page's own submit handler, so nothing is sent.
    document.addEventListener('submit', function(e) {
        var form = e.target;
        if (!isLeadForm(form)) return;
        var input = form.querySelector('input[name="phone"]');
        if (!input) return;
        if (egValidPhone(input.value)) {
            var old = input.nextElementSibling;
            if (old && old.classList.contains('eg-phone-err')) old.remove();
            return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        errEl(input).textContent = PHONE_MSG;
        input.style.borderColor = '#dc2626';
        input.focus();
    }, true);

    // Clear the message as soon as the visitor edits the number.
    document.addEventListener('input', function(e) {
        var input = e.target;
        if (!input || input.name !== 'phone' || !isLeadForm(input.form)) return;
        var n = input.nextElementSibling;
        if (n && n.classList.contains('eg-phone-err')) n.remove();
        input.style.borderColor = '';
    }, true);
})();

/**
 * ELDERGO MESSAGE-BOX LIMIT (TeleCRM refuses notes over 1,024 characters)
 * Any textarea with data-eg-max="900" (plus maxlength="900") gets a live
 * "123 / 900" counter under it: grey, amber near the limit, red at the limit.
 * maxlength cuts typed and pasted text; the counter updates on every input
 * (including paste) and after the form is reset.
 */
(function() {
    function counterFor(ta) {
        var n = ta.nextElementSibling;
        if (n && n.classList.contains('eg-char-count')) return n;
        n = document.createElement('p');
        n.className = 'eg-char-count';
        n.setAttribute('aria-live', 'polite');
        n.style.cssText = 'font-size:12px;line-height:1.3;color:#6b7280;margin:4px 0 0;text-align:right;';
        ta.insertAdjacentElement('afterend', n);
        return n;
    }

    function update(ta) {
        var max = parseInt(ta.getAttribute('data-eg-max'), 10);
        if (!max) return;
        if (ta.value.length > max) ta.value = ta.value.slice(0, max);
        var len = ta.value.length;
        var n = counterFor(ta);
        n.textContent = len + ' / ' + max;
        n.style.color = len >= max ? '#dc2626' : (len >= max * 0.9 ? '#d97706' : '#6b7280');
        n.style.fontWeight = len >= max * 0.9 ? '600' : '400';
    }

    function initAll() {
        var list = document.querySelectorAll('textarea[data-eg-max]');
        for (var i = 0; i < list.length; i++) update(list[i]);
    }

    document.addEventListener('input', function(e) {
        var t = e.target;
        if (t && t.tagName === 'TEXTAREA' && t.hasAttribute('data-eg-max')) update(t);
    }, true);

    document.addEventListener('reset', function(e) {
        var form = e.target;
        setTimeout(function() {
            var list = form.querySelectorAll ? form.querySelectorAll('textarea[data-eg-max]') : [];
            for (var i = 0; i < list.length; i++) update(list[i]);
        }, 0);
    }, true);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
