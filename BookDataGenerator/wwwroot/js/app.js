// File: wwwroot/js/app.js - FINAL, DEFINITIVE, & ROBUST VERSION

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    // A single source of truth for the application's state.
    let state = {
        currentView: 'table', // 'table' or 'card'. Default to table as per HR.
        locale: 'en',
        seed: 42,
        page: 0,
        isLoading: false,
        allBooks: [],
        avgLikes: 1.0,
        avgReviews: 1.0
    };

    // --- DOM REFERENCES ---
    // A single object to hold references to all necessary DOM elements.
    const dom = {
        viewTableBtn: document.getElementById('view-table-btn'),
        viewCardBtn: document.getElementById('view-card-btn'),
        localeSelect: document.getElementById('locale-select'),
        seedInput: document.getElementById('seed'),
        randomSeedBtn: document.getElementById('random-seed-btn'),
        likesSlider: document.getElementById('likes-slider'),
        likesValueSpan: document.getElementById('likes-value'),
        reviewsSlider: document.getElementById('reviews-slider'),
        reviewsValueSpan: document.getElementById('reviews-value'),
        contentWrapper: document.querySelector('.content-wrapper'),
        tableContainer: document.getElementById('table-container'),
        booksTbody: document.getElementById('books-tbody'),
        cardGridContainer: document.getElementById('card-grid-container'),
        loader: document.getElementById('loader'),
        modal: document.getElementById('details-modal')
    };

    // This single IntersectionObserver is the key to a correct infinite scroll.
    let observer;

    // --- CORE LOGIC ---

    /**
     * Fetches a new batch of books from the server. This is the only function
     * that makes a network request. It returns `true` if it loaded more data,
     * and `false` if it reached the end.
     */
    const fetchBooks = async () => {
        if (state.isLoading) return false;
        state.isLoading = true;
        dom.loader.style.display = 'block';

        try {
            const url = `/api/books?locale=${state.locale}&seed=${state.seed}&page=${state.page}&likes=${state.avgLikes}&reviews=${state.avgReviews}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const newBooks = await response.json();

            if (newBooks && newBooks.length > 0) {
                state.allBooks.push(...newBooks);
                renderNewBooks(newBooks);
                state.page++;
                return true; // Success, more data was loaded.
            } else {
                if (observer) observer.disconnect(); // No more data, stop listening for scrolls.
                dom.loader.style.display = 'none';
                console.log("No more books to load.");
                return false; // Failure, we're at the end.
            }
        } catch (error) {
            console.error("Failed to fetch books:", error);
            return false;
        } finally {
            state.isLoading = false;
            // Don't hide the loader here; let the success/failure logic handle it.
        }
    };

    /**
     * THE DEFINITIVE FIX for the "infinite loading" loop.
     * This function's job is to load data until the screen has a scrollbar,
     * and ONLY THEN activate the user-driven infinite scroll.
     */
    const checkAndLoadUntilScrollable = async () => {
        if (observer) observer.disconnect();

        let hasMoreData = await fetchBooks();

        // While there is more data AND the content is not tall enough to scroll, keep loading.
        while (hasMoreData && document.documentElement.scrollHeight <= window.innerHeight) {
            console.log("Viewport not full. Fetching another batch to fill the screen.");
            hasMoreData = await fetchBooks();
        }

        // Now that the screen is full (or we're out of data), start the real scroll listener.
        if (hasMoreData) {
            observer.observe(dom.loader);
        }
    };

    // --- RENDERING ---
    const renderNewBooks = (books) => {
        const isTableView = state.currentView === 'table';
        const container = isTableView ? dom.booksTbody : dom.cardGridContainer;
        const renderFunc = isTableView ? renderAsTableRow : renderAsCard;
        const fragment = document.createDocumentFragment();
        books.forEach(book => fragment.appendChild(renderFunc(book)));
        container.appendChild(fragment);
    };

    const renderAsTableRow = (book) => {
        const tr = document.createElement('tr');
        tr.dataset.bookIndex = book.index;
        tr.innerHTML = `<td>${book.index}</td><td>${book.isbn}</td><td>${book.title}</td><td>${book.authors.join(', ')}</td><td>${book.publisher}</td>`;
        return tr;
    };

    const renderAsCard = (book) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.dataset.bookIndex = book.index;
        card.innerHTML = `<img src="${book.coverImageUrl}" alt="Cover for ${book.title}" class="card-cover-image" loading="lazy"><div class="card-content"><h3 class="card-title" title="${book.title}">${book.title}</h3><p class="card-author">${book.authors.join(', ')}</p></div>`;
        return card;
    };

    // --- MODAL & VIEW SWITCHING ---
    const showBookDetails = (book) => {
        if (!book) return;
        const reviewsHtml = book.reviews.map(r => `<div class="review-item"><strong>${r.reviewerName}</strong><p>${r.reviewText}</p></div>`).join('');
        const modalContent = dom.modal.querySelector('.modal-content');
        modalContent.innerHTML = `<span class="close-btn">&times;</span><div class="modal-main-content"><div class="modal-cover-wrapper"><img src="${book.coverImageUrl}" alt="Cover for ${book.title}"></div><div class="modal-details-wrapper"><h3>${book.title}</h3><p><strong>Author(s):</strong> ${book.authors.join(', ')}</p><p><strong>Publisher:</strong> ${book.publisher}</p><p><strong>ISBN:</strong> ${book.isbn}</p><p><strong>❤️ Likes:</strong> ${book.likes}</p></div></div>` + (book.reviews.length ? `<div class="modal-reviews-container"><h4>Reviews</h4>${reviewsHtml}</div>` : '');
        modalContent.querySelector('.close-btn').addEventListener('click', hideModal);
        dom.modal.classList.add('visible');
    };

    const hideModal = () => dom.modal.classList.remove('visible');

    const setView = (view) => {
        if (state.currentView === view) return;
        state.currentView = view;
        const isTableView = view === 'table';
        dom.viewTableBtn.classList.toggle('active', isTableView);
        dom.viewCardBtn.classList.toggle('active', !isTableView);
        dom.tableContainer.classList.toggle('active', isTableView);
        dom.cardGridContainer.classList.toggle('active', !isTableView);
        dom.booksTbody.innerHTML = '';
        dom.cardGridContainer.innerHTML = '';
        renderNewBooks(state.allBooks);
        // After switching views, re-check if scrolling is needed.
        checkAndLoadUntilScrollable();
    };

    const handleControlChange = () => {
        state.page = 0;
        state.allBooks = [];
        dom.booksTbody.innerHTML = '';
        dom.cardGridContainer.innerHTML = '';
        // Start the robust loading process from scratch.
        checkAndLoadUntilScrollable();
    };

    // --- INITIALIZATION ---
    const initialize = () => {
        // Create the observer ONCE.
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !state.isLoading) {
                fetchBooks();
            }
        }, { threshold: 0.1 });

        // Setup all user interaction listeners.
        dom.viewTableBtn.addEventListener('click', () => setView('table'));
        dom.viewCardBtn.addEventListener('click', () => setView('card'));
        dom.contentWrapper.addEventListener('click', (e) => {
            const target = e.target.closest('tr[data-book-index], .book-card[data-book-index]');
            if (target) {
                const book = state.allBooks.find(b => b.index === parseInt(target.dataset.bookIndex));
                showBookDetails(book);
            }
        });
        dom.localeSelect.addEventListener('change', (e) => { state.locale = e.target.value; handleControlChange(); });
        dom.seedInput.addEventListener('change', (e) => { state.seed = e.target.value; handleControlChange(); });
        dom.randomSeedBtn.addEventListener('click', () => { dom.seedInput.value = state.seed = Math.floor(Math.random() * 1000000); handleControlChange(); });
        dom.likesSlider.addEventListener('change', (e) => { state.avgLikes = parseFloat(e.target.value); handleControlChange(); });
        dom.reviewsSlider.addEventListener('change', (e) => { state.avgReviews = parseFloat(e.target.value); handleControlChange(); });
        dom.likesSlider.addEventListener('input', (e) => { dom.likesValueSpan.textContent = parseFloat(e.target.value).toFixed(1); });
        dom.reviewsSlider.addEventListener('input', (e) => { dom.reviewsValueSpan.textContent = parseFloat(e.target.value).toFixed(1); });
        dom.modal.addEventListener('click', (e) => { if (e.target === dom.modal) hideModal(); });

        // Set the initial state of the UI controls.
        dom.localeSelect.value = state.locale;
        dom.seedInput.value = state.seed;
        dom.likesSlider.value = state.avgLikes;
        dom.likesValueSpan.textContent = state.avgLikes.toFixed(1);
        dom.reviewsSlider.value = state.avgReviews;
        dom.reviewsValueSpan.textContent = state.avgReviews.toFixed(1);

        // Start the application by calling the robust loading function.
        checkAndLoadUntilScrollable();
    };

    initialize();
});