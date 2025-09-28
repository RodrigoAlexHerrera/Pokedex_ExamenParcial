/**
 * CLASE PRINCIPAL POKÉDEX
 * Maneja toda la funcionalidad de la aplicación Pokédex
 */
class Pokedex {
  constructor() {
    // URL base de la API de Pokémon
    this.baseUrl = "https://pokeapi.co/api/v2/pokemon/"

    // Cargar favoritos desde localStorage
    this.favorites = this.loadFavorites()

    // Estado actual de la vista: 'grid', 'detail', o 'favorites'
    this.currentView = "grid"

    // Pokémon actualmente mostrado en detalle
    this.currentPokemon = null

    // Cache para evitar llamadas repetidas a la API
    this.pokemonCache = new Map()

    // Inicializar elementos del DOM y eventos
    this.initializeElements()
    this.bindEvents()
  }

  /**
   * INICIALIZACIÓN DE ELEMENTOS DEL DOM
   * Obtiene referencias a todos los elementos HTML necesarios
   */
  initializeElements() {
    this.elements = {
      searchInput: document.getElementById("searchInput"),
      searchButton: document.getElementById("searchButton"),
      loadInitialButton: document.getElementById("loadInitialButton"),
      showFavoritesButton: document.getElementById("showFavoritesButton"),
      loading: document.getElementById("loading"),
      pokemonGrid: document.getElementById("pokemonGrid"),
      pokemonDetail: document.getElementById("pokemonDetail"),
    }
  }

  /**
   * VINCULACIÓN DE EVENTOS
   * Asigna event listeners a los elementos interactivos
   */
  bindEvents() {
    // Evento de búsqueda con botón
    this.elements.searchButton.addEventListener("click", () => this.searchPokemon())

    // Evento de búsqueda con Enter
    this.elements.searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.searchPokemon()
    })

    // Cargar Pokémon iniciales
    this.elements.loadInitialButton.addEventListener("click", () => this.loadInitialPokemon())

    // Mostrar favoritos
    this.elements.showFavoritesButton.addEventListener("click", () => this.showFavorites())
  }

  /**
   * MOSTRAR INDICADOR DE CARGA
   * Muestra el spinner y oculta otros contenidos
   */
  showLoading() {
    this.elements.loading.classList.add("loading--visible")
    this.elements.pokemonGrid.innerHTML = ""
    this.elements.pokemonDetail.classList.remove("pokemon-detail--visible")
  }

  /**
   * OCULTAR INDICADOR DE CARGA
   */
  hideLoading() {
    this.elements.loading.classList.remove("loading--visible")
  }

  /**
   * OBTENER DATOS DE UN POKÉMON
   * Hace fetch a la API con cache para optimizar rendimiento
   */
  async fetchPokemon(query) {
    try {
      const url = `${this.baseUrl}${query.toLowerCase()}`

      // Verificar cache primero
      if (this.pokemonCache.has(url)) {
        return this.pokemonCache.get(url)
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Pokémon no encontrado: ${query}`)
      }

      const pokemon = await response.json()

      // Guardar en cache
      this.pokemonCache.set(url, pokemon)

      return pokemon
    } catch (error) {
      console.error("Error fetching Pokemon:", error)
      throw error
    }
  }

  /**
   * OBTENER MÚLTIPLES POKÉMON
   * Obtiene una lista de Pokémon (por defecto los primeros 20)
   */
  async fetchMultiplePokemon(limit = 20, offset = 0) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
      const data = await response.json()

      // Obtener datos completos de cada Pokémon
      const pokemonPromises = data.results.map((pokemon) => this.fetchPokemon(pokemon.name))

      return await Promise.all(pokemonPromises)
    } catch (error) {
      console.error("Error fetching multiple Pokemon:", error)
      throw error
    }
  }

  /**
   * BUSCAR POKÉMON POR NOMBRE O ID
   * Maneja la búsqueda individual desde el campo de entrada
   */
  async searchPokemon() {
    const query = this.elements.searchInput.value.trim()
    if (!query) {
      alert("Por favor, ingresa el nombre o ID de un Pokémon")
      return
    }

    this.showLoading()

    try {
      const pokemon = await this.fetchPokemon(query)
      this.showPokemonDetail(pokemon)
      this.currentView = "detail"
    } catch (error) {
      alert(error.message)
    } finally {
      this.hideLoading()
    }
  }

  /**
   * CARGAR POKÉMON INICIALES
   * Carga y muestra los primeros 20 Pokémon en formato grid
   */
  async loadInitialPokemon() {
    this.showLoading()

    try {
      const pokemonList = await this.fetchMultiplePokemon(20)
      this.showPokemonGrid(pokemonList)
      this.currentView = "grid"
    } catch (error) {
      alert("Error al cargar los Pokémon iniciales")
    } finally {
      this.hideLoading()
    }
  }

  /**
   * MOSTRAR GRID DE POKÉMON
   * Renderiza una lista de Pokémon en formato de tarjetas
   */
  showPokemonGrid(pokemonList) {
    this.elements.pokemonDetail.classList.remove("pokemon-detail--visible")

    // Generar HTML para cada tarjeta de Pokémon
    const gridHTML = pokemonList
      .map(
        (pokemon) => `
            <div class="pokemon-card" data-pokemon-id="${pokemon.id}">
                <button class="pokemon-card__favorite ${this.isFavorite(pokemon.id) ? "pokemon-card__favorite--active" : ""}" 
                        data-pokemon-id="${pokemon.id}">
                    ♥
                </button>
                <img class="pokemon-card__image" 
                     src="${pokemon.sprites.front_default}" 
                     alt="${pokemon.name}"
                     loading="lazy">
                <div class="pokemon-card__name">${pokemon.name}</div>
                <div class="pokemon-card__id">#${pokemon.id.toString().padStart(3, "0")}</div>
            </div>
        `,
      )
      .join("")

    this.elements.pokemonGrid.innerHTML = gridHTML

    // Asignar eventos a las tarjetas y botones de favorito
    this.elements.pokemonGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".pokemon-card")
      const favoriteBtn = e.target.closest(".pokemon-card__favorite")

      if (favoriteBtn) {
        // Manejar clic en botón de favorito
        e.stopPropagation()
        this.toggleFavorite(Number.parseInt(favoriteBtn.dataset.pokemonId))
        favoriteBtn.classList.toggle("pokemon-card__favorite--active")
      } else if (card) {
        // Manejar clic en tarjeta para mostrar detalle
        const pokemonId = Number.parseInt(card.dataset.pokemonId)
        const pokemon = pokemonList.find((p) => p.id === pokemonId)
        if (pokemon) {
          this.showPokemonDetail(pokemon)
          this.currentView = "detail"
        }
      }
    })
  }

  /**
   * MOSTRAR DETALLE DE POKÉMON
   * Renderiza la vista detallada de un Pokémon específico
   */
  showPokemonDetail(pokemon) {
    this.currentPokemon = pokemon
    this.elements.pokemonGrid.innerHTML = ""

    const detailHTML = `
            <div class="pokemon-detail__header">
                <h2 class="pokemon-detail__title">${pokemon.name} #${pokemon.id.toString().padStart(3, "0")}</h2>
                <div class="pokemon-detail__types">
                    ${pokemon.types
                      .map(
                        (type) =>
                          `<span class="pokemon-type pokemon-type--${type.type.name}">${type.type.name.toUpperCase()}</span>`,
                      )
                      .join("")}
                </div>
            </div>
            
            <img class="pokemon-detail__image" 
                 src="${pokemon.sprites.front_default}" 
                 alt="${pokemon.name}">
            
            <div class="pokemon-detail__basic-info">
                <div class="pokemon-detail__info-card">
                    <span class="pokemon-detail__info-label">Peso:</span>
                    <span class="pokemon-detail__info-value">${pokemon.weight / 10} kg</span>
                </div>
                <div class="pokemon-detail__info-card">
                    <span class="pokemon-detail__info-label">Altura:</span>
                    <span class="pokemon-detail__info-value">${pokemon.height / 10} m</span>
                </div>
            </div>
            
            <button class="pokemon-detail__favorite-btn ${this.isFavorite(pokemon.id) ? "pokemon-detail__favorite-btn--remove" : "pokemon-detail__favorite-btn--add"}" 
                    id="favoriteDetailBtn">
                ${this.isFavorite(pokemon.id) ? "QUITAR DE FAVORITOS" : "AGREGAR A FAVORITOS"}
            </button>
            
            <div class="pokemon-detail__stats">
                <h3>Estadísticas Base</h3>
                ${pokemon.stats
                  .map(
                    (stat) => `
                    <div class="stat">
                        <div class="stat__name">${this.translateStatName(stat.stat.name)}</div>
                        <div class="stat__bar">
                            <div class="stat__fill" style="width: ${(stat.base_stat / 255) * 100}%"></div>
                        </div>
                        <div class="stat__value">${stat.base_stat}</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        `

    this.elements.pokemonDetail.innerHTML = detailHTML
    this.elements.pokemonDetail.classList.add("pokemon-detail--visible")

    // Asignar evento al botón de favorito en vista detalle
    document.getElementById("favoriteDetailBtn").addEventListener("click", () => {
      this.toggleFavorite(pokemon.id)
      this.showPokemonDetail(pokemon) // Refrescar la vista
    })
  }

  /**
   * MOSTRAR POKÉMON FAVORITOS
   * Carga y muestra todos los Pokémon marcados como favoritos
   */
  async showFavorites() {
    if (this.favorites.length === 0) {
      this.elements.pokemonGrid.innerHTML = '<div class="text-center">No tienes Pokémon favoritos aún</div>'
      this.elements.pokemonDetail.classList.remove("pokemon-detail--visible")
      this.currentView = "favorites"
      return
    }

    this.showLoading()

    try {
      // Obtener datos de todos los Pokémon favoritos
      const favoritePromises = this.favorites.map((id) => this.fetchPokemon(id.toString()))
      const favoritePokemon = await Promise.all(favoritePromises)
      this.showPokemonGrid(favoritePokemon)
      this.currentView = "favorites"
    } catch (error) {
      alert("Error al cargar los Pokémon favoritos")
    } finally {
      this.hideLoading()
    }
  }

  /**
   * ALTERNAR ESTADO DE FAVORITO
   * Agrega o quita un Pokémon de la lista de favoritos
   */
  toggleFavorite(pokemonId) {
    const index = this.favorites.indexOf(pokemonId)
    if (index > -1) {
      // Quitar de favoritos
      this.favorites.splice(index, 1)
    } else {
      // Agregar a favoritos
      this.favorites.push(pokemonId)
    }
    this.saveFavorites()
  }

  /**
   * VERIFICAR SI ES FAVORITO
   * Comprueba si un Pokémon está en la lista de favoritos
   */
  isFavorite(pokemonId) {
    return this.favorites.includes(pokemonId)
  }

  /**
   * CARGAR FAVORITOS DESDE LOCALSTORAGE
   * Recupera la lista de favoritos guardada localmente
   */
  loadFavorites() {
    const saved = localStorage.getItem("pokedex-favorites")
    return saved ? JSON.parse(saved) : []
  }

  /**
   * GUARDAR FAVORITOS EN LOCALSTORAGE
   * Persiste la lista de favoritos localmente
   */
  saveFavorites() {
    localStorage.setItem("pokedex-favorites", JSON.stringify(this.favorites))
  }

  /**
   * TRADUCIR NOMBRES DE ESTADÍSTICAS
   * Convierte nombres de stats en inglés a abreviaciones en español
   */
  translateStatName(statName) {
    const translations = {
      hp: "HP",
      attack: "ATQ",
      defense: "DEF",
      "special-attack": "ATQ ESP",
      "special-defense": "DEF ESP",
      speed: "VEL",
    }
    return translations[statName] || statName.toUpperCase()
  }
}

/**
 * INICIALIZACIÓN DE LA APLICACIÓN
 * Crea una instancia de Pokédex cuando se carga la página
 */
document.addEventListener("DOMContentLoaded", () => {
  new Pokedex()
})
