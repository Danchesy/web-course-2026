(() => {
    function createModel() {
        return {
            allPosts: [],
            filteredPosts: [],
            currentPage: 1,
            limit: 10,
            isLoading: false,
            hasMore: true,
            searchQuery: '',
            debounceTimer: null
        };
    }

    function createView() {
        return {
            container: document.getElementById('posts-container'),
            loader: document.getElementById('loader'),
            errorDiv: document.getElementById('error-message'),
            endMessage: document.getElementById('end-message'),
            searchInput: document.getElementById('search-input')
        };
    }

    function createController(model, view) {
        async function fetchPosts() {
            if (model.isLoading || !model.hasMore) return;

            model.isLoading = true;
            view.loader.classList.remove('hidden');
            view.errorDiv.classList.add('hidden');

            try {
                const response = await fetch(
                    `https://jsonplaceholder.typicode.com/posts?_page=${model.currentPage}&_limit=${model.limit}`
                );

                if (!response.ok) {
                    throw new Error(`http error: ${response.status}`);
                }

                const data = await response.json();

                if (data.length === 0) {
                    model.hasMore = false;
                    view.endMessage.classList.remove('hidden');
                } else {
                    model.allPosts = model.allPosts.concat(data);
                    model.currentPage++;
                    applyFilter();
                }
            } catch (error) {
                view.errorDiv.textContent = 'failed to load posts. please try again later.';
                view.errorDiv.classList.remove('hidden');
                console.error('fetch error:', error);
            } finally {
                model.isLoading = false;
                view.loader.classList.add('hidden');
            }
        }

        function applyFilter() {
            const query = model.searchQuery.toLowerCase().trim();
            if (query === '') {
                model.filteredPosts = model.allPosts;
            } else {
                model.filteredPosts = model.allPosts.filter(post =>
                    post.title.toLowerCase().includes(query)
                );
            }
            renderPosts();
        }

        function renderPosts() {
            view.container.innerHTML = '';

            if (model.filteredPosts.length === 0 && model.allPosts.length > 0) {
                view.container.innerHTML = '<p style="text-align:center;color:#888;">nothing found</p>';
                return;
            }

            model.filteredPosts.forEach(post => {
                const card = document.createElement('div');
                card.className = 'post-card';

                const title = document.createElement('h3');
                title.textContent = post.title;

                const body = document.createElement('p');
                body.textContent = post.body;

                const author = document.createElement('small');
                author.textContent = `author id: ${post.userId}`;

                card.appendChild(title);
                card.appendChild(body);
                card.appendChild(author);
                view.container.appendChild(card);
            });
        }

        function handleSearchInput(e) {
            model.searchQuery = e.target.value;

            clearTimeout(model.debounceTimer);
            model.debounceTimer = setTimeout(() => {
                applyFilter();
            }, 300);
        }

        function handleScroll() {
            const scrollPosition = window.innerHeight + window.scrollY;
            const threshold = document.body.offsetHeight - 200;

            if (scrollPosition >= threshold) {
                fetchPosts();
            }
        }

        function init() {
            view.searchInput.addEventListener('input', handleSearchInput);
            window.addEventListener('scroll', handleScroll);

            fetchPosts();
        }

        return { init };
    }

    const model = createModel();
    const view = createView();
    const controller = createController(model, view);

    controller.init();
})();