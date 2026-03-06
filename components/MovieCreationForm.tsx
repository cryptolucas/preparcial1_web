"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { createMovie, createActor, createPrize, addMovieToActor, addPrizeToMovie, getGenres, getDirectors, getTrailers, createTrailer } from "@/services/api";

interface ParcialFormInputs {
  movieTitle: string; moviePoster: string; movieDuration: number; movieCountry: string; movieReleaseDate: string; moviePopularity: number;
  genreId: string; directorId: string;
  trailerId: string; // Para el select
  trailerName: string; trailerUrl: string; trailerDuration: number; trailerChannel: string; // Para crear
  actorName: string; actorPhoto: string; actorNationality: string; actorBirthDate: string; actorBiography: string;
  prizeName: string; prizeCategory: string; prizeYear: number; prizeStatus: string;
}

function MovieCreationForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ParcialFormInputs>();
  
  // Listas del backend
  const [genres, setGenres] = useState<any[]>([]);
  const [directors, setDirectors] = useState<any[]>([]);
  const [trailers, setTrailers] = useState<any[]>([]);
  
  // ESTADO PARA CONTROLAR EL MODO DEL TRAILER (Por defecto: Crear)
  const [trailerMode, setTrailerMode] = useState<"select" | "create">("create");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [genresData, directorsData, trailersData] = await Promise.all([getGenres(), getDirectors(), getTrailers()]);
        setGenres(genresData);
        setDirectors(directorsData);
        setTrailers(trailersData);
      } catch (error) {
        console.error("Error cargando las listas:", error);
      }
    };
    loadData();
  }, []);

  const onSubmit: SubmitHandler<ParcialFormInputs> = async (data) => {
    try {
      let finalTrailerId = "";

      // LOGICA DUAL PARA EL TRAILER
      if (trailerMode === "create") {
        const newTrailer = await createTrailer({
          name: data.trailerName, url: data.trailerUrl, duration: Number(data.trailerDuration), channel: data.trailerChannel
        });
        finalTrailerId = newTrailer.id;
        console.log("Trailer creado:", finalTrailerId);
      } else {
        finalTrailerId = data.trailerId;
        console.log("Trailer seleccionado:", finalTrailerId);
      }

      // 1. CREAR PELÍCULA
      const newMovie = await createMovie({
        title: data.movieTitle, poster: data.moviePoster, duration: Number(data.movieDuration), country: data.movieCountry, releaseDate: data.movieReleaseDate, popularity: Number(data.moviePopularity),
        genre: { id: data.genreId }, director: { id: data.directorId },
        youtubeTrailer: { id: finalTrailerId } // <--- Usamos el ID que resultó de la lógica de arriba
      });

      // 2. CREAR ACTOR
      const newActor = await createActor({
        name: data.actorName, photo: data.actorPhoto, nationality: data.actorNationality, birthDate: data.actorBirthDate, biography: data.actorBiography
      });

      // 3. ASIGNAR PELÍCULA A ACTOR
      await addMovieToActor(newActor.id, newMovie.id);

      // 4. CREAR PREMIO
      const newPrize = await createPrize({
        name: data.prizeName, category: data.prizeCategory, year: Number(data.prizeYear), status: data.prizeStatus 
      });

      // 5. ASIGNAR PREMIO A PELÍCULA
      await addPrizeToMovie(newMovie.id, newPrize.id);

      alert("✅ ¡Éxito! Flujo completo ejecutado.");
      reset();
      setTrailerMode("create"); // Reiniciar el modo

    } catch (error) {
      console.error("Error en el flujo:", error);
      alert("❌ Hubo un error. Revisa la consola. Si seleccionaste un trailer, verifica que no esté usado por otra película.");
    }
  };

  // Estilos
  const inputStyle = { padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", width: "100%", backgroundColor: "#f9fafb" };
  const labelStyle = { fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "4px", display: "block" };
  const sectionStyle = { backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", marginBottom: "24px" };
  const titleStyle = { fontSize: "18px", fontWeight: "bold", color: "#111827", borderBottom: "2px solid #e5e7eb", paddingBottom: "8px", marginBottom: "16px" };
  const gridStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" };

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "2rem" }}>Registro de Película</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* --- 1. PELÍCULA --- */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>🎬 1. Datos de la Película</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Título</label><input style={inputStyle} {...register("movieTitle", { required: true })} /></div>
            <div><label style={labelStyle}>URL del Poster</label><input type="url" style={inputStyle} {...register("moviePoster", { required: true })} /></div>
            <div><label style={labelStyle}>Duración (min)</label><input type="number" style={inputStyle} {...register("movieDuration", { required: true })} /></div>
            <div><label style={labelStyle}>País</label><input style={inputStyle} {...register("movieCountry", { required: true })} /></div>
            <div><label style={labelStyle}>Fecha de Estreno</label><input type="date" style={inputStyle} {...register("movieReleaseDate", { required: true })} /></div>
            <div><label style={labelStyle}>Popularidad</label><input type="number" style={inputStyle} {...register("moviePopularity", { required: true })} /></div>
            <div>
              <label style={labelStyle}>Género</label>
              <select style={inputStyle} {...register("genreId", { required: true })}>
                <option value="">Seleccionar...</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.type || g.id.substring(0,5)}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Director</label>
              <select style={inputStyle} {...register("directorId", { required: true })}>
                <option value="">Seleccionar...</option>
                {directors.map(d => <option key={d.id} value={d.id}>{d.name || d.id.substring(0,5)}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- 2. TRAILER (DUAL) --- */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>📺 2. Trailer</h3>
          
          {/* BOTONES PARA ELEGIR EL MODO */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "bold" }}>
              <input type="radio" checked={trailerMode === "create"} onChange={() => setTrailerMode("create")} />
              Crear Nuevo Trailer
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "bold" }}>
              <input type="radio" checked={trailerMode === "select"} onChange={() => setTrailerMode("select")} />
              Seleccionar Existente
            </label>
          </div>

          {/* RENDERIZADO CONDICIONAL BASADO EN EL MODO */}
          {trailerMode === "create" ? (
            <div style={gridStyle}>
              <div><label style={labelStyle}>Nombre del Video</label><input style={inputStyle} {...register("trailerName", { required: trailerMode === "create" })} /></div>
              <div><label style={labelStyle}>URL de Youtube</label><input type="url" style={inputStyle} {...register("trailerUrl", { required: trailerMode === "create" })} /></div>
              <div><label style={labelStyle}>Duración (seg)</label><input type="number" style={inputStyle} {...register("trailerDuration", { required: trailerMode === "create" })} /></div>
              <div><label style={labelStyle}>Canal</label><input style={inputStyle} {...register("trailerChannel", { required: trailerMode === "create" })} /></div>
            </div>
          ) : (
            <div>
              <label style={labelStyle}>Seleccione un Trailer (¡Asegúrese de que no esté en uso!)</label>
              <select style={inputStyle} {...register("trailerId", { required: trailerMode === "select" })}>
                <option value="">-- Seleccionar Trailer --</option>
                {trailers.map(t => <option key={t.id} value={t.id}>{t.name || t.id.substring(0,5)}</option>)}
              </select>
            </div>
          )}
        </div>

        {/* --- 3. ACTOR --- */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>🎭 3. Actor Principal</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Nombre</label><input style={inputStyle} {...register("actorName", { required: true })} /></div>
            <div><label style={labelStyle}>Foto (URL)</label><input type="url" style={inputStyle} {...register("actorPhoto", { required: true })} /></div>
            <div><label style={labelStyle}>Nacionalidad</label><input style={inputStyle} {...register("actorNationality", { required: true })} /></div>
            <div><label style={labelStyle}>Fecha de Nac</label><input type="date" style={inputStyle} {...register("actorBirthDate", { required: true })} /></div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <label style={labelStyle}>Biografía</label>
            <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} {...register("actorBiography", { required: true })} />
          </div>
        </div>

        {/* --- 4. PREMIO --- */}
        <div style={sectionStyle}>
          <h3 style={titleStyle}>🏆 4. Premio</h3>
          <div style={gridStyle}>
            <div><label style={labelStyle}>Nombre del Premio</label><input style={inputStyle} {...register("prizeName", { required: true })} /></div>
            <div><label style={labelStyle}>Categoría</label><input style={inputStyle} {...register("prizeCategory", { required: true })} /></div>
            <div><label style={labelStyle}>Año</label><input type="number" style={inputStyle} {...register("prizeYear", { required: true })} /></div>
            <div>
              <label style={labelStyle}>Estado</label>
              <select style={inputStyle} {...register("prizeStatus", { required: true })}>
                <option value="">Seleccione...</option>
                <option value="won">Ganado (won)</option>
                <option value="nominated">Nominado (nominated)</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" style={{ width: "100%", padding: "16px", backgroundColor: "#2563eb", color: "white", fontSize: "16px", fontWeight: "bold", borderRadius: "8px", border: "none", cursor: "pointer" }}>
          Guardar Flujo Completo
        </button>
      </form>
    </div>
  );
}

export default MovieCreationForm;