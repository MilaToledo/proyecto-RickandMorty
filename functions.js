const API_BASE = 'https://rickandmortyapi.com/api';

// Fetch all characters with pagination
async function fetchAllCharacters() {
    let allCharacters = [];
    let nextUrl = `${API_BASE}/character`;
    
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            allCharacters = [...allCharacters, ...data.results];
            nextUrl = data.info.next;
        }
        return allCharacters;
    } catch (error) {
        console.error('Error fetching characters:', error);
        return [];
    }
}

// Fetch all episodes with pagination
async function fetchAllEpisodes() {
    let allEpisodes = [];
    let nextUrl = `${API_BASE}/episode`;
    
    try {
        while (nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            allEpisodes = [...allEpisodes, ...data.results];
            nextUrl = data.info.next;
        }
        return allEpisodes;
    } catch (error) {
        console.error('Error fetching episodes:', error);
        return [];
    }
}

// Display characters in the DOM with pagination
function displayCharacters(characters, page = 1) {
    const section = document.querySelector('.character-section');
    const grid = section.querySelector('.character-grid');
    grid.innerHTML = '';
    section.classList.remove('hidden');

    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedCharacters = characters.slice(startIndex, startIndex + itemsPerPage);

    paginatedCharacters.forEach(character => {
        const characterCard = document.createElement('div');
        characterCard.className = 'character-card';
        characterCard.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
            <p>Status: ${character.status}</p>
            <p>Species: ${character.species}</p>
        `;
        grid.appendChild(characterCard);
    });

    return {
        currentPage: page,
        totalPages: Math.ceil(characters.length / itemsPerPage),
        totalItems: characters.length
    };
}

// Display episodes in the DOM with pagination
function displayEpisodes(episodes, page = 1) {
    const section = document.querySelector('.episode-section');
    const list = section.querySelector('.episode-list');
    list.innerHTML = '';
    section.classList.remove('hidden');

    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedEpisodes = episodes.slice(startIndex, startIndex + itemsPerPage);

    paginatedEpisodes.forEach(episode => {
        const episodeCard = document.createElement('div');
        episodeCard.className = 'episode-card';
        episodeCard.innerHTML = `
            <h3>${episode.episode}: ${episode.name}</h3>
            <p>Air Date: ${episode.air_date}</p>
        `;
        list.appendChild(episodeCard);
    });

    return {
        currentPage: page,
        totalPages: Math.ceil(episodes.length / itemsPerPage),
        totalItems: episodes.length
    };
}

// Update pagination controls
function updatePaginationControls(paginationInfo, type) {
    const controls = document.querySelector(`.pagination-controls.${type}`);
    const firstBtn = controls.querySelector('.first-page');
    const prevBtn = controls.querySelector('.prev-page');
    const nextBtn = controls.querySelector('.next-page');
    const lastBtn = controls.querySelector('.last-page');
    const pageInfo = controls.querySelector('.page-info');

    // Update button states
    firstBtn.disabled = paginationInfo.currentPage === 1;
    prevBtn.disabled = paginationInfo.currentPage === 1;
    nextBtn.disabled = paginationInfo.currentPage === paginationInfo.totalPages;
    lastBtn.disabled = paginationInfo.currentPage === paginationInfo.totalPages;

    // Update page info
    pageInfo.textContent = `Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;
}

export { 
    fetchAllCharacters, 
    fetchAllEpisodes, 
    displayCharacters, 
    displayEpisodes,
    updatePaginationControls 
};
