const API_BASE = 'https://rickandmortyapi.com/api';


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
            <div class="character-card-inner">
                <div class="character-card-front">
                    <img src="${character.image}" alt="${character.name}">
                    <h3>${character.name}</h3>
                </div>
                <div class="character-card-back">
                    <h3>${character.name}</h3>
                    <p class="status ${character.status.toLowerCase()}">Status: ${character.status}</p>
                    <p>Species: ${character.species}</p>
                    <p>Gender: ${character.gender}</p>
                    <p>Origin: ${character.origin.name}</p>
                    <p>Episodes: ${character.episode.length}</p>
                </div>
            </div>
        `;
        grid.appendChild(characterCard);
    });

    return {
        currentPage: page,
        totalPages: Math.ceil(characters.length / itemsPerPage),
        totalItems: characters.length
    };
}


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


function updatePaginationControls(paginationInfo, type) {
    const controls = document.querySelector(`.pagination-controls.${type}`);
    const firstBtn = controls.querySelector('.first-page');
    const prevBtn = controls.querySelector('.prev-page');
    const nextBtn = controls.querySelector('.next-page');
    const lastBtn = controls.querySelector('.last-page');
    const pageInfo = controls.querySelector('.page-info');

 
    firstBtn.disabled = paginationInfo.currentPage === 1;
    prevBtn.disabled = paginationInfo.currentPage === 1;
    nextBtn.disabled = paginationInfo.currentPage === paginationInfo.totalPages;
    lastBtn.disabled = paginationInfo.currentPage === paginationInfo.totalPages;

   
    pageInfo.textContent = `Page ${paginationInfo.currentPage} of ${paginationInfo.totalPages}`;
}

async function showEpisodeDetails(episode) {
    const detailsSection = document.querySelector('.episode-details-section');
    const episodeSection = document.querySelector('.episode-section');
    
    // Update episode info
    document.querySelector('.episode-title').textContent = episode.name;
    document.querySelector('.episode-code').textContent = episode.episode;
    document.querySelector('.episode-air-date').textContent = `Aired: ${episode.air_date}`;
    
    // Fetch and display characters
    const charactersGrid = document.querySelector('.episode-characters-grid');
    charactersGrid.innerHTML = '';
    
    const characterPromises = episode.characters.map(url => fetch(url).then(res => res.json()));
    const characters = await Promise.all(characterPromises);
    
    characters.forEach(character => {
        const card = document.createElement('div');
        card.className = 'episode-character-card';
        card.innerHTML = `
            <img src="${character.image}" alt="${character.name}">
            <h4>${character.name}</h4>
        `;
        charactersGrid.appendChild(card);
    });
    
    // Show details section
    episodeSection.classList.add('hidden');
    detailsSection.classList.remove('hidden');
    
    // Back button handler
    document.querySelector('.back-button').onclick = () => {
        detailsSection.classList.add('hidden');
        episodeSection.classList.remove('hidden');
    };
}

export { 
    fetchAllCharacters, 
    fetchAllEpisodes, 
    displayCharacters, 
    displayEpisodes,
    updatePaginationControls,
    showEpisodeDetails
};
