document.addEventListener('DOMContentLoaded', () => {
    let state = { locale: 'en', seed: 42, page: 0, averageLikes: 1.0, averageReviews: 1.0, isLoading: false, allBooks: [] }; const localeSelect = document.getElementById('locale-select'); const seedInput = document.getElementById('seed'); const randomSeedBtn = document.getElementById('random-seed-btn'); const likesSlider = document.getElementById('likes-slider'); const likesValueSpan = document.getElementById('likes-value'); const reviewsSlider = document.getElementById('reviews-slider'); const reviewsValueSpan = document.getElementById('reviews-value'); const cardGridContainer = document.getElementById('card-grid-container'); const modal = document.getElementById('details-modal'); const modalBody = document.getElementById('modal-body'); const closeModalBtn = document.querySelector('.close-btn'); let observer; async function fetchBooks() { if (state.isLoading) return; state.isLoading = true; try { const url = `/api/books?locale=${state.locale}&seed=${state.seed}&page=${state.page}&likes=${state.averageLikes}&reviews=${state.averageReviews}`; const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const newBooks = await response.json(); if (newBooks.length > 0) { state.allBooks.push(...newBooks); renderBookCards(newBooks); state.page++; } else { if (observer) observer.disconnect(); } } catch (error) { console.error("Failed to fetch books:", error); } finally { state.isLoading = false; } }
    function renderBookCards(books) { if (observer) observer.disconnect(); const fragment = document.createDocumentFragment(); books.forEach(book => { const card = document.createElement('div'); card.className = 'book-card'; card.dataset.bookIndex = book.index; card.innerHTML = `<img src="${book.coverImageUrl}" alt="Cover for ${book.title}" class="card-cover-image" loading="lazy"><div class="card-content"><h3 class="card-title" title="${book.title}">${book.title}</h3><p class="card-author">${book.authors.join(', ')}</p></div>`; fragment.appendChild(card); }); cardGridContainer.appendChild(fragment); const lastCard = cardGridContainer.querySelector('.book-card:last-child'); if (lastCard) { observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !state.isLoading) { fetchBooks(); } }, { threshold: 0.1 }); observer.observe(lastCard); } }
    function resetBookData() { if (observer) observer.disconnect(); cardGridContainer.innerHTML = ''; state.page = 0; state.allBooks = []; } function handleControlChange() { resetBookData(); fetchBooks(); } function hideModal() { modal.classList.remove('visible'); }

    function showBookDetails(book) {
        if (!book) return;

        // We now build the HTML in two separate parts.
        const mainContentHtml = `
            <div class="modal-main-content">
                <div class="modal-cover-wrapper">
                    <img src="${book.coverImageUrl}" alt="Cover for ${book.title}">
                </div>
                <div class="modal-details-wrapper">
                    <h3>${book.title}</h3>
                    <p><strong>Author(s):</strong> ${book.authors.join(', ')}</p>
                    <p><strong>Publisher:</strong> ${book.publisher}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>❤️ Likes:</strong> ${book.likes}</p>
                </div>
            </div>
        `;

        // The reviews section is built conditionally.
        let reviewsContentHtml = '';
        if (book.reviews && book.reviews.length > 0) {
            const reviewsHtml = book.reviews.map(review => `
                <div class="review-item">
                    <strong>${review.reviewerName}</strong>
                    <p>${review.reviewText}</p>
                </div>
            `).join('');

            reviewsContentHtml = `
                <div class="modal-reviews-container">
                    <h4>Reviews</h4>
                    ${reviewsHtml}
                </div>
            `;
        }

        // The `modal-body` (now renamed conceptually to the modal's direct content)
        // is composed of the two parts.
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = `
            <span class="close-btn">&times;</span>
            ${mainContentHtml}
            ${reviewsContentHtml}
        `;

        // Re-attach the close button listener since we overwrote it.
        modalContent.querySelector('.close-btn').addEventListener('click', hideModal);

        modal.classList.add('visible');
    }

    // The main click listener is now simplified since showBookDetails handles everything.
    cardGridContainer.addEventListener('click', (event) => {
        const cardElement = event.target.closest('.book-card');
        if (cardElement) {
            const bookIndex = parseInt(cardElement.dataset.bookIndex, 10);
            const bookToDisplay = state.allBooks.find(b => b.index === bookIndex);
            showBookDetails(bookToDisplay);
        }
    });

    localeSelect.addEventListener('change', () => { state.locale = localeSelect.value; handleControlChange(); }); seedInput.addEventListener('change', () => { state.seed = parseInt(seedInput.value, 10) || 42; handleControlChange(); }); likesSlider.addEventListener('input', () => { likesValueSpan.textContent = parseFloat(likesSlider.value).toFixed(1); }); likesSlider.addEventListener('change', () => { state.averageLikes = parseFloat(likesSlider.value); handleControlChange(); }); reviewsSlider.addEventListener('input', () => { reviewsValueSpan.textContent = parseFloat(reviewsSlider.value).toFixed(1); }); reviewsSlider.addEventListener('change', () => { state.averageReviews = parseFloat(reviewsSlider.value); handleControlChange(); }); randomSeedBtn.addEventListener('click', () => { const randomSeed = Math.floor(Math.random() * 1000000); seedInput.value = randomSeed; state.seed = randomSeed; handleControlChange(); }); closeModalBtn.addEventListener('click', hideModal); modal.addEventListener('click', (event) => { if (event.target === modal) { hideModal(); } }); function initialize() { localeSelect.value = state.locale; seedInput.value = state.seed; likesSlider.value = state.averageLikes; likesValueSpan.textContent = state.averageLikes.toFixed(1); reviewsSlider.value = state.averageReviews; reviewsValueSpan.textContent = state.averageReviews.toFixed(1); fetchBooks(); } initialize();
});