import { 
    fetchAllCharacters, 
    fetchAllEpisodes, 
    displayCharacters, 
    displayEpisodes,
    updatePaginationControls 
} from './functions.js';


const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('#search-input');
const searchType = document.querySelector('#search-type');
const loader = document.querySelector('.loader-container');
const characterSection = document.querySelector('.character-section');
const episodeSection = document.querySelector('.episode-section');


async function initApp() {
    try {
        showLoader();
        
        
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


let currentCharacters = [];
let currentEpisodes = [];
let currentType = '';
let currentPage = 1;


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


function setupSearch() {
    const sortSelect = document.querySelector('#search-sort');
    
 
    sortSelect.addEventListener('change', () => {
        if (currentType === 'character' && currentCharacters.length > 0) {
            if (sortSelect.value === 'asc') {
                currentCharacters.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortSelect.value === 'desc') {
                currentCharacters.sort((a, b) => b.name.localeCompare(a.name));
            }
            updateDisplay('character');
        } else if (currentType === 'episode' && currentEpisodes.length > 0) {
            if (sortSelect.value === 'asc') {
                currentEpisodes.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortSelect.value === 'desc') {
                currentEpisodes.sort((a, b) => b.name.localeCompare(a.name));
            }
            updateDisplay('episode');
        }
    });

    
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
                
                
                const sortSelect = document.querySelector('#search-sort');
                if (sortSelect.value === 'asc') {
                    currentCharacters.sort((a, b) => a.name.localeCompare(b.name));
                } else if (sortSelect.value === 'desc') {
                    currentCharacters.sort((a, b) => b.name.localeCompare(a.name));
                }
                
                updateDisplay('character');
            } else if (currentType === 'episode') {
                currentEpisodes = await fetchAllEpisodes();
                currentEpisodes = currentEpisodes.filter(ep => 
                    ep.name.toLowerCase().includes(query)
                );
                
              
                const sortSelect = document.querySelector('#search-sort');
                if (sortSelect.value === 'asc') {
                    currentEpisodes.sort((a, b) => a.name.localeCompare(b.name));
                } else if (sortSelect.value === 'desc') {
                    currentEpisodes.sort((a, b) => b.name.localeCompare(a.name));
                }
                
                updateDisplay('episode');
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            hideLoader();
        }
    });
}


function showLoader() {
    loader.classList.add('visible');
}

function hideLoader() {
    loader.classList.remove('visible');
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        showLoader();
        
       
        currentCharacters = await fetchAllCharacters();
        currentEpisodes = await fetchAllEpisodes();
        
        
        setupSearch();
        
       
        setupPaginationListeners('character');
        setupPaginationListeners('episode');
        
        
        characterSection.classList.remove('hidden');
        episodeSection.classList.add('hidden');
        updateDisplay('character');
        
        hideLoader();
    } catch (error) {
        console.error('Initialization error:', error);
        hideLoader();
    }
});
