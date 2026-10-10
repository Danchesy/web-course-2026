// global state
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const limit = 10;
let isLoading = false;
let hasMore = true;
let searchQuery = '';
let debounceTimer = null;

// dom elements
const container = document.getElementById('posts-container');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error-message');
const endMessage = document.getElementById('end-message');
const searchInput = document.getElementById('search-input');

// fetch posts from api with error handling
async function fetchPosts() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    loader.classList.remove('hidden');
    errorDiv.classList.add('hidden');

    try {
        const response = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_page=${currentPage}&_limit=${limit}`
        );

        if (!response.ok) {
            throw new Error(`http error: ${response.status}`);
        }

        const data = await response.json();

        if (data.length === 0) {
            hasMore = false;
            endMessage.classList.remove('hidden');
        } else {
            allPosts = allPosts.concat(data);
            currentPage++;
            applyFilter();
        }
    } catch (error) {
        errorDiv.textContent = 'failed to load posts. please try again later.';
        errorDiv.classList.remove('hidden');
        console.error('fetch error:', error);
    } finally {
        isLoading = false;
        loader.classList.add('hidden');
    }
}

// filter posts by search query without new requests
function applyFilter() {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') {
        filteredPosts = allPosts;
    } else {
        filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(query)
        );
    }
    renderPosts();
}

// render filtered posts to dom
function renderPosts() {
    container.innerHTML = '';

    if (filteredPosts.length === 0 && allPosts.length > 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;">nothing found</p>';
        return;
    }

    filteredPosts.forEach(post => {
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
        container.appendChild(card);
    });
}

// debounce for search input
function handleSearchInput(e) {
    searchQuery = e.target.value;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        applyFilter();
    }, 300);
}

// infinite scroll handler
function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight - 200;

    if (scrollPosition >= threshold) {
        fetchPosts();
    }
}

// event listeners
searchInput.addEventListener('input', handleSearchInput);
window.addEventListener('scroll', handleScroll);

// initial load
fetchPosts();