"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Movie, Actor, getMovies, updateActor, updateActorMovies } from "@/services/api";

interface ActorEditFormProps {
  actor: Actor;
}

interface EditFormInputs {
  name: string;
  photo: string;
  nationality: string;
  birthDate: string;
  biography: string;
  movies: string[] | string; 
}

function ActorEditForm({ actor }: ActorEditFormProps) {
  const router = useRouter();
  const [availableMovies, setAvailableMovies] = useState<Movie[]>([]);

  const defaultMovieIds = actor.movies ? actor.movies.map((m) => m.id) : [];

  const { register, handleSubmit, formState: { errors } } = useForm<EditFormInputs>({
    defaultValues: {
      name: actor.name,
      photo: actor.photo,
      nationality: actor.nationality,
      birthDate: actor.birthDate ? actor.birthDate.split("T")[0] : "",
      biography: actor.biography,
      movies: defaultMovieIds, 
    },
  });

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

  const onSubmit: SubmitHandler<EditFormInputs> = async (data) => {
    try {
      // PASO 1: Actualizar datos básicos
      const updatedActorData = {
        name: data.name,
        photo: data.photo,
        nationality: data.nationality,
        birthDate: data.birthDate,
        biography: data.biography,
      };

      await updateActor(actor.id, updatedActorData);

      // PASO 2: Sincronizar las peliculas usando el controlador de relaciones
      const selectedMovieIds = Array.isArray(data.movies) ? data.movies : (data.movies ? [data.movies] : []);
      const formattedMovies = selectedMovieIds.map(movieId => ({ id: movieId }));
      
      await updateActorMovies(actor.id, formattedMovies);

      alert("¡Actor y películas actualizados con éxito!");
      router.push("/actores"); 
      router.refresh(); 

    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un error al actualizar el actor. Revisa la consola.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Nombre:</label>
        <input type="text" {...register("name", { required: true })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Foto (URL):</label>
        <input type="url" {...register("photo", { required: true })} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Nacionalidad:</label>
        <input type="text" {...register("nationality")} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Fecha de Nacimiento:</label>
        <input type="date" {...register("birthDate")} />
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Biografía:</label>
        <textarea rows={4} {...register("biography")} />
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
        Guardar Cambios
      </button>
    </form>
  );
}

export default ActorEditForm;