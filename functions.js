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

async function showCharacterDetails(character) {
    const detailsSection = document.querySelector('.character-details-section');
    const characterSection = document.querySelector('.character-section');

  
    const episodesList = detailsSection.querySelector('.character-episodes-list');
    episodesList.innerHTML = '';

    try {
        const episodePromises = character.episode.map(url => fetch(url).then(res => res.json()));
        const episodes = await Promise.all(episodePromises);

        episodes.forEach(episode => {
            const li = document.createElement('li');
            li.textContent = `${episode.episode}: ${episode.name}`;
            li.style.cursor = 'pointer';
            li.addEventListener('click', async () => {
                await showEpisodeDetails(episode);
                detailsSection.classList.add('hidden');
            });
            episodesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching character episodes:', error);
        episodesList.innerHTML = '<li>Error loading episodes</li>';
    }

    
    characterSection.classList.add('hidden');
    detailsSection.classList.remove('hidden');

    // Back button handler
    detailsSection.querySelector('.character-back-button').onclick = () => {
        detailsSection.classList.add('hidden');
        characterSection.classList.remove('hidden');
    };
}

async function showEpisodeDetails(episode) {
    const detailsSection = document.querySelector('.episode-details-section');
    const episodeSection = document.querySelector('.episode-section');
    const characterDetailsSection = document.querySelector('.character-details-section');

  
    const episodeImage = detailsSection.querySelector('.episode-image');
    if (episode.image) {
        episodeImage.src = episode.image;
        episodeImage.alt = episode.name;
        episodeImage.style.display = 'block';
    } else {
        episodeImage.style.display = 'none';
    }

    detailsSection.querySelector('.episode-title').textContent = episode.name;
    detailsSection.querySelector('.episode-code').textContent = episode.episode;
    detailsSection.querySelector('.episode-air-date').textContent = `Aired: ${episode.air_date}`;

    
    const charactersGrid = detailsSection.querySelector('.episode-characters-grid');
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

   
    episodeSection.classList.add('hidden');
    characterDetailsSection.classList.add('hidden');
    detailsSection.classList.remove('hidden');

   
    detailsSection.querySelector('.back-button').onclick = () => {
        detailsSection.classList.add('hidden');
        characterDetailsSection.classList.remove('hidden');
    };
}

export { 
    fetchAllCharacters, 
    fetchAllEpisodes, 
    displayCharacters, 
    displayEpisodes,
    updatePaginationControls,
    showEpisodeDetails,
    showCharacterDetails
};
