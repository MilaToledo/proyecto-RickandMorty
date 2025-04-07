import { 
    fetchAllCharacters, 
    fetchAllEpisodes, 
    displayCharacters, 
    displayEpisodes,
    updatePaginationControls 
} from './functions.js';

// DOM Elements
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('#search-input');
const searchType = document.querySelector('#search-type');
const loader = document.querySelector('.loader-container');
const characterSection = document.querySelector('.character-section');
const episodeSection = document.querySelector('.episode-section');

// Initialize the app
async function initApp() {
    try {
        showLoader();
        
        // Load all characters and episodes on startup
        const [characters, episodes] = await Promise.all([
            fetchAllCharacters(),
            fetchAllEpisodes()
        ]);

        displayCharacters(characters);
        displayEpisodes(episodes);
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        hideLoader();
    }
}

// Global pagination variables
let currentCharacters = [];
let currentEpisodes = [];
let currentType = '';
let currentPage = 1;

// Handle page navigation
function setupPaginationListeners(type) {
        const controls = document.querySelector(`.pagination-controls.${type}`);
        
        controls.querySelector('.first-page').addEventListener('click', () => {
            currentPage = 1;
            updateDisplay(type);
        });

        controls.querySelector('.prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateDisplay(type);
            }
        });

        controls.querySelector('.next-page').addEventListener('click', () => {
            const totalPages = type === 'character' 
                ? Math.ceil(currentCharacters.length / 20)
                : Math.ceil(currentEpisodes.length / 20);
            
            if (currentPage < totalPages) {
                currentPage++;
                updateDisplay(type);
            }
        });

        controls.querySelector('.last-page').addEventListener('click', () => {
            currentPage = type === 'character' 
                ? Math.ceil(currentCharacters.length / 20)
                : Math.ceil(currentEpisodes.length / 20);
            updateDisplay(type);
        });
    }

function updateDisplay(type) {
        if (type === 'character') {
            const pagination = displayCharacters(currentCharacters, currentPage);
            updatePaginationControls(pagination, type);
        } else {
            const pagination = displayEpisodes(currentEpisodes, currentPage);
            updatePaginationControls(pagination, type);
        }
    }

// Search functionality with pagination
function setupSearch() {
    // Handle search type changes
    searchType.addEventListener('change', (e) => {
        currentType = e.target.value;
        currentPage = 1;
        
        if (currentType === 'character') {
            characterSection.classList.remove('hidden');
            episodeSection.classList.add('hidden');
            updateDisplay('character');
        } else if (currentType === 'episode') {
            characterSection.classList.add('hidden');
            episodeSection.classList.remove('hidden');
            updateDisplay('episode');
        }
    });

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.toLowerCase();
        currentType = searchType.value;
        currentPage = 1;

        try {
            showLoader();
            
            if (currentType === 'character') {
                currentCharacters = await fetchAllCharacters();
                currentCharacters = currentCharacters.filter(char => 
                    char.name.toLowerCase().includes(query)
                );
                updateDisplay('character');
            } else if (currentType === 'episode') {
                currentEpisodes = await fetchAllEpisodes();
                currentEpisodes = currentEpisodes.filter(ep => 
                    ep.name.toLowerCase().includes(query)
                );
                updateDisplay('episode');
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            hideLoader();
        }
    });
}

// Helper functions
function showLoader() {
    loader.classList.add('visible');
}

function hideLoader() {
    loader.classList.remove('visible');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoader();
        
        // Load and store initial data
        currentCharacters = await fetchAllCharacters();
        currentEpisodes = await fetchAllEpisodes();
        
        // Set up search functionality
        setupSearch();
        
        // Initialize pagination listeners
        setupPaginationListeners('character');
        setupPaginationListeners('episode');
        
        // Show characters by default, hide episodes
        characterSection.classList.remove('hidden');
        episodeSection.classList.add('hidden');
        updateDisplay('character');
        
        hideLoader();
    } catch (error) {
        console.error('Initialization error:', error);
        hideLoader();
    }
});
