"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getMovieById } from "@/services/api";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (movieId) {
      getMovieById(movieId)
        .then((data) => {
          setMovie(data);
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [movieId]);

  if (isLoading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando detalle...</p>;
  if (!movie) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Película no encontrada.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/peliculas" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", display: "inline-block", marginBottom: "1rem" }}>
        &larr; Volver al listado
      </Link>

      <div style={{ border: "1px solid #d1d5db", padding: "24px", borderRadius: "12px", backgroundColor: "#ffffff", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}>
        
        <div style={{ display: "flex", gap: "24px", borderBottom: "2px solid #e5e7eb", paddingBottom: "20px", marginBottom: "20px" }}>
          <img src={movie.poster} alt={movie.title} style={{ width: "200px", height: "auto", borderRadius: "8px", objectFit: "cover" }} />
          
          <div>
            <h2 style={{ fontSize: "32px", margin: "0 0 16px 0", color: "#111827" }}>{movie.title}</h2>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>Duración:</strong> {movie.duration} minutos</p>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>País:</strong> {movie.country}</p>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>Fecha de Estreno:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>Popularidad:</strong> {movie.popularity}</p>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>Género:</strong> {movie.genre?.type || "N/A"}</p>
            <p style={{ margin: "8px 0", fontSize: "16px" }}><strong>Director:</strong> {movie.director?.name || "N/A"}</p>
          </div>
        </div>

        {/* LISTADO DE AUTORES (ACTORES) */}
        <div>
          <h3 style={{ fontSize: "24px", color: "#1f2937", marginBottom: "12px" }}>🎭 Listado de Autores (Actores)</h3>
          {movie.actors && movie.actors.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
              {movie.actors.map((actor: any) => (
                <li key={actor.id} style={{ backgroundColor: "#f3f4f6", padding: "12px", borderRadius: "6px", border: "1px solid #e5e7eb" }}>
                  <strong>{actor.name}</strong> - {actor.nationality} <br/>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>Nacimiento: {new Date(actor.birthDate).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#6b7280" }}>No hay autores asociados a esta película.</p>
          )}
        </div>

      </div>
    </div>
  );
}