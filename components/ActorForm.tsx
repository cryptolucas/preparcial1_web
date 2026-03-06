"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Movie, getMovies, createActor, updateActorMovies } from "@/services/api";

interface ActorFormInputs {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies: string[] | string; 
}

function ActorForm() {
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActorFormInputs>();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setAvailableMovies(data);
      } catch (error) {
        console.error("Error al cargar las películas:", error);
      }
    };
    fetchMovies();
  }, []);

  const onSubmit: SubmitHandler<ActorFormInputs> = async (data) => {
    try {
      // PASO 1: Crear el actor (solo datos básicos)
      const newActorData = {
        name: data.name,
        photo: data.photo,
        nationality: data.nationality,
        birthDate: data.birthDate,
        biography: data.biography,
      };

      const createdActor = await createActor(newActorData);

      // PASO 2: Vincular las películas al nuevo actor
      const selectedMovieIds = Array.isArray(data.movies) ? data.movies : (data.movies ? [data.movies] : []);
      const formattedMovies = selectedMovieIds.map(movieId => ({ id: movieId }));

      // Solo hacemos la petición si se seleccionó al menos una película
      if (formattedMovies.length > 0) {
        await updateActorMovies(createdActor.id, formattedMovies);
      }
      
      alert("¡Actor creado y películas vinculadas con éxito!");
      reset(); 

    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un error en el proceso. Revisa la consola para más detalles.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Nombre:</label>
        <input type="text" {...register("name", { required: true })} />
        {errors.name && <span style={{ color: "red", fontSize: "12px" }}>Requerido</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Foto (URL):</label>
        <input type="url" {...register("photo", { required: true })} />
        {errors.photo && <span style={{ color: "red", fontSize: "12px" }}>Requerido</span>}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Nacionalidad:</label>
        <input type="text" {...register("nationality", { required: true })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Fecha de Nacimiento:</label>
        <input type="date" {...register("birthDate", { required: true })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Biografía:</label>
        <textarea rows={4} {...register("biography", { required: true })} />
      </div>

      <hr style={{ margin: "1rem 0" }} />
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <h4>Selecciona las películas:</h4>
        {availableMovies.length === 0 ? (
          <p style={{ fontSize: "14px", color: "gray" }}>Cargando películas disponibles...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "150px", overflowY: "auto", border: "1px solid #ccc", padding: "0.5rem" }}>
            {availableMovies.map((movie) => (
              <label key={movie.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" value={movie.id} {...register("movies")} />
                {movie.title}
              </label>
            ))}
          </div>
        )}
      </div>

      <button type="submit" style={{ padding: "0.5rem", cursor: "pointer", marginTop: "1rem", backgroundColor: "#0070f3", color: "white", border: "none" }}>
        Crear Actor
      </button>
    </form>
  );
}

export default ActorForm;