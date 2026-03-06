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

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${BASE_URL}/movies`);
  if (!response.ok) throw new Error("Error al obtener las películas");
  return response.json();
}