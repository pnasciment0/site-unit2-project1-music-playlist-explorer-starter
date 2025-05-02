let currentModalPlaylist = null;

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((playlists) => {
        playlists.forEach(createPlaylistCard);
      })
      .catch((error) => {
        console.error("Failed to load playlist data:", error);
      });
  
    // Modal close on overlay click
    const modalOverlay = document.getElementById("modal");
    modalOverlay.addEventListener("click", (e) => {
      if (e.target.id === "modal") {
        closeModal();
      }
    });

    document.getElementById("shuffle-button").addEventListener("click", () => {
        if (currentModalPlaylist) {
          shuffleArray(currentModalPlaylist.songs);
          renderSongs(currentModalPlaylist.songs);
        }
      });
  });
  
  function createPlaylistCard(playlist) {
    const container = document.querySelector(".playlist-cards");
  
    const card = document.createElement("div");
    card.classList.add("playlist-card");
  
    card.innerHTML = `
      <img class="playlist-art" src="${playlist.playlist_art}" alt="${playlist.playlist_name}">
      <div class="playlist-info">
        <h3 class="playlist-title">${playlist.playlist_name}</h3>
        <p class="playlist-author">By ${playlist.playlist_author}</p>
        <p class="playlist-likes">${playlist.songs.length} songs</p>
        <div class="like-section">
            <span class="like-icon" data-liked="false">&#9825;</span>
            <span class="like-count">0</span>
        </div>
      </div>
    `;

    const likeIcon = card.querySelector(".like-icon");
    const likeCount = card.querySelector(".like-count");

    likeIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent modal from opening

    const liked = likeIcon.dataset.liked === "true";
    const count = parseInt(likeCount.textContent);

    if (liked) {
        likeIcon.dataset.liked = "false";
        likeIcon.innerHTML = "&#9825;"; // empty heart
        likeCount.textContent = count - 1;
    } else {
        likeIcon.dataset.liked = "true";
        likeIcon.innerHTML = "&#9829;"; // filled heart
        likeCount.textContent = count + 1;
    }
    });
  
    // Add click listener to show modal
    card.addEventListener("click", () => {
      populateModal(playlist);
      openModal();
    });
  
    container.appendChild(card);
  }
  
  function populateModal(playlist) {
    currentModalPlaylist = playlist; // Store reference
  
    document.getElementById("modal-playlist-image").src = playlist.playlist_art;
    document.getElementById("modal-playlist-name").textContent = playlist.playlist_name;
    document.getElementById("modal-playlist-author").textContent = `By ${playlist.playlist_author}`;
  
    renderSongs(playlist.songs);
  }

  function renderSongs(songs) {
    const songListContainer = document.getElementById("modal-song-list");
    songListContainer.innerHTML = ""; // Clear previous content
  
    songs.forEach((song) => {
      const songItem = document.createElement("div");
      songItem.classList.add("song-item");
  
      songItem.innerHTML = `
        <img src="${song.album_art}" alt="${song.title} Cover" class="song-cover" />
        <div class="song-details">
          <p class="song-title">${song.title}</p>
          <p class="song-meta">${song.artist} · ${song.album}</p>
        </div>
        <span class="song-duration">${song.duration}</span>
      `;
  
      songListContainer.appendChild(songItem);
    });
  }
  
  
  function openModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex"; // Should be 'flex' for centering
  }
  
  function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    // Only run if we're on the Featured page
    if (window.location.pathname.includes("featured.html")) {
      fetch("data/data.json")
        .then((response) => {
          if (!response.ok) throw new Error("Failed to load playlist data");
          return response.json();
        })
        .then((playlists) => {
          const randomIndex = Math.floor(Math.random() * playlists.length);
          const playlist = playlists[randomIndex];
          displayFeaturedPlaylist(playlist);
        })
        .catch((error) => console.error("Error loading featured playlist:", error));
    }
  });
  
  function displayFeaturedPlaylist(playlist) {
    const image = document.getElementById("featured-image");
    const name = document.getElementById("featured-name");
    const songsList = document.getElementById("featured-songs");
  
    image.src = playlist.playlist_art;
    image.alt = playlist.playlist_name;
    name.textContent = playlist.playlist_name;
  
    songsList.innerHTML = "";
    playlist.songs.forEach((song) => {
      const li = document.createElement("li");
      li.textContent = `${song.title} — ${song.artist}`;
      songsList.appendChild(li);
    });
  }
  
  