# Pokédex Web Application

Una aplicación web moderna que permite explorar y gestionar información de Pokémon utilizando la API pública de PokéAPI. Desarrollada como proyecto académico usando únicamente tecnologías web nativas.

## Descripción del Proyecto

Esta Pokédex web es una aplicación de página única (SPA) que consume datos de la [PokéAPI](https://pokeapi.co/) para mostrar información detallada de Pokémon. Los usuarios pueden buscar Pokémon específicos, explorar una lista inicial, ver estadísticas detalladas y gestionar una lista de favoritos personalizada.

## Objetivos de Aprendizaje

- Consumo de APIs REST utilizando Fetch API
- Manipulación dinámica del DOM con JavaScript vanilla
- Implementación de metodología BEM en CSS
- Gestión de estado local con localStorage
- Desarrollo de interfaces responsivas
- Manejo de eventos y programación asíncrona

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos con metodología BEM y diseño responsivo
- **JavaScript ES6+**: Lógica de aplicación y manipulación del DOM
- **Fetch API**: Consumo de servicios web
- **LocalStorage**: Persistencia de datos del lado del cliente
- **PokéAPI**: Fuente de datos de Pokémon

## Funcionalidades

### Búsqueda de Pokémon
- Búsqueda por nombre o ID numérico
- Validación de entrada en tiempo real
- Manejo de errores para búsquedas no encontradas

### Visualización de Datos
- **Información básica**: Nombre, imagen oficial, tipos
- **Características físicas**: Altura y peso
- **Estadísticas base**: HP, Ataque, Defensa, Velocidad, etc.
- **Barras de progreso**: Representación visual de estadísticas

### Sistema de Favoritos
- Marcar/desmarcar Pokémon como favoritos
- Persistencia de favoritos en localStorage
- Sección dedicada "Mis Favoritos"
- Contador dinámico de favoritos

### Diseño Responsivo
- Adaptable a dispositivos móviles, tablets y desktop
- Grid responsivo para lista de Pokémon
- Interfaz optimizada para diferentes tamaños de pantalla

## Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para consumir la API

### Instrucciones de Instalación

1. **Clonar el repositorio**
   \`\`\`bash
   git clone https://github.com/tu-usuario/pokedex-web.git
   cd pokedex-web
   \`\`\`

2. **Abrir la aplicación**
   - Opción 1: Abrir `index.html` directamente en el navegador
   - Opción 2: Usar un servidor local (recomendado)
   \`\`\`bash

3. **Acceder a la aplicación**
   - Navegador directo: `file:///ruta/al/proyecto/index.html`
   - Servidor local: `http://localhost:8000`

## Estructura del Proyecto

\`\`\`
pokedex-web/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS con metodología BEM
├── script.js           # Lógica JavaScript de la aplicación
└── README.md           # Documentación del proyecto
\`\`\`

## Metodología BEM

El proyecto implementa la metodología BEM (Block Element Modifier) para organizar el CSS:

\`\`\`css
/* Bloque */
.pokemon-card { }

/* Elemento */
.pokemon-card__title { }
.pokemon-card__image { }

/* Modificador */
.pokemon-card--favorite { }
.pokemon-card__button--active { }
\`\`\`

## Funciones Principales

### `searchPokemon(query)`
Busca un Pokémon específico por nombre o ID.

### `loadInitialPokemon()`
Carga los primeros 20 Pokémon de la API.

### `showPokemonDetail(pokemon)`
Muestra la información detallada de un Pokémon.

### `toggleFavorite(pokemon)`
Gestiona la adición/eliminación de favoritos.

### `loadFavorites()`
Carga y muestra los Pokémon favoritos desde localStorage.

## API Utilizada

**PokéAPI**: `https://pokeapi.co/api/v2/pokemon/{id-or-name}`

### Endpoints Principales:
- `GET /pokemon/{id}` - Información específica de un Pokémon
- `GET /pokemon?limit=20` - Lista de Pokémon con paginación

## Características Responsivas

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Grid adaptativo**: 1-4 columnas según el dispositivo

## Manejo de Errores

- Validación de entrada en búsquedas
- Mensajes informativos para Pokémon no encontrados
- Fallbacks para imágenes no disponibles
- Manejo de errores de conectividad

## Video

[![Pokédex Demo](https://img.youtube.com/vi/QuDafbXRlI0/0.jpg)](https://youtu.be/QuDafbXRlI0)
