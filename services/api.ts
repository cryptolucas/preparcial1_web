export interface Movie {
  id: string;
  title: string;
}

export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies: Movie[];
}

const BASE_URL = "http://localhost:3000/api/v1";

// --- ACTORES (Datos Basicos) ---

export async function getActors(): Promise<Actor[]> {
  const response = await fetch(`${BASE_URL}/actors`);
  if (!response.ok) throw new Error("Error al obtener los actores");
  return response.json();
}

export async function getActorById(id: string): Promise<Actor> {
  const response = await fetch(`${BASE_URL}/actors/${id}`);
  if (!response.ok) throw new Error("Error al obtener el actor");
  return response.json();
}

// Solo enviamos los datos basicos definidos en el ActorDto
export async function createActor(actorData: Omit<Actor, "id" | "movies">): Promise<Actor> {
  const response = await fetch(`${BASE_URL}/actors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actorData),
  });
  if (!response.ok) throw new Error("Error al crear el actor");
  return response.json(); 
}

export async function updateActor(id: string, actorData: Omit<Actor, "id" | "movies">): Promise<Actor> {
  const response = await fetch(`${BASE_URL}/actors/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(actorData),
  });
  if (!response.ok) throw new Error("Error al actualizar el actor");
  return response.json();
}

export async function deleteActor(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/actors/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el actor");
}

// --- RELACIONES ACTOR-PELICULA ---

// Conecta con el ActorMovieController (@Put en /actors/:actorId/movies)
export async function updateActorMovies(actorId: string, movies: { id: string }[]): Promise<Actor> {
  const response = await fetch(`${BASE_URL}/actors/${actorId}/movies`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movies),
  });
  if (!response.ok) throw new Error("Error al actualizar las películas del actor");
  return response.json();
}

// --- PELICULAS ---



export async function getMovies(): Promise<any[]> {
  const response = await fetch(`${BASE_URL}/movies`, {
    cache: "no-store" // <--- LA CLAVE PARA EL PARCIAL: Fuerza a traer los datos frescos siempre
  });
  if (!response.ok) throw new Error("Error al obtener las películas");
  return response.json();
}


// PARCIAL---------------------------------------------------------



// 1. Crear Película
export async function createMovie(movieData: any) {
  const response = await fetch(`${BASE_URL}/movies`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(movieData),
  });
  if (!response.ok) throw new Error("Error al crear la película");
  return response.json();
}

// 2. Asociar Película a Actor (POST)
export async function addMovieToActor(actorId: string, movieId: string) {
  const response = await fetch(`${BASE_URL}/actors/${actorId}/movies/${movieId}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Error al asociar la película al actor");
  return response.json();
}

// 3. Crear Premio
export async function createPrize(prizeData: any) {
  const response = await fetch(`${BASE_URL}/prizes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prizeData),
  });
  if (!response.ok) throw new Error("Error al crear el premio");
  return response.json();
}

// 4. Asociar Premio a Película (POST)
export async function addPrizeToMovie(movieId: string, prizeId: string) {
  const response = await fetch(`${BASE_URL}/movies/${movieId}/prizes/${prizeId}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Error al asociar el premio a la película");
  return response.json();
}


// --- FUNCIONES PARA CARGAR LISTAS (GÉNEROS, DIRECTORES, TRAILERS) ---

export async function getGenres() {
  const response = await fetch(`${BASE_URL}/genres`);
  if (!response.ok) throw new Error("Error al obtener los géneros");
  return response.json();
}

export async function getDirectors() {
  const response = await fetch(`${BASE_URL}/directors`);
  if (!response.ok) throw new Error("Error al obtener los directores");
  return response.json();
}

export async function getTrailers() {
  const response = await fetch(`${BASE_URL}/youtube-trailers`); // Asumiendo la ruta estándar de tu YoutubeTrailerModule
  if (!response.ok) throw new Error("Error al obtener los trailers");
  return response.json();
}


// Crear nuevo Trailer
export async function createTrailer(trailerData: any) {
  const response = await fetch(`${BASE_URL}/youtube-trailers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(trailerData),
  });
  if (!response.ok) throw new Error("Error al crear el trailer");
  return response.json();
}


// --- FUNCIONES PARA LOS PUNTOS 2 Y 3 ---




export async function getMovieById(id: string) {
  const response = await fetch(`${BASE_URL}/movies/${id}`, { cache: 'no-store' });
  if (!response.ok) throw new Error("Error al obtener el detalle de la película");
  return response.json();
}

