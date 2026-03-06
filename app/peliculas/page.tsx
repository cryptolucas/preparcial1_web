"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMovies } from "@/services/api";

export default function MoviesListPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMovies()
      .then((data) => {
        setMovies(data);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  if (isLoading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando películas...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "bold", borderBottom: "2px solid #e5e7eb", paddingBottom: "10px", marginBottom: "20px" }}>
        🎬 Listado de Películas
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {movies.map((movie) => (
          <div key={movie.id} style={{ border: "1px solid #d1d5db", padding: "16px", borderRadius: "8px", backgroundColor: "#f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "20px", margin: "0 0 8px 0", color: "#111827" }}>{movie.title}</h3>
              <p style={{ margin: "4px 0", color: "#4b5563" }}>
                <strong>Estreno:</strong> {new Date(movie.releaseDate).toLocaleDateString()}
              </p>
              <p style={{ margin: "4px 0", color: "#4b5563" }}>
                {/* Mostramos el primer actor o el director como "Autor" */}
                <strong>Autor/Actor:</strong> {movie.actors?.[0]?.name || movie.director?.name || "Sin autor registrado"}
              </p>
              <p style={{ margin: "4px 0", color: "#4b5563" }}>
                {/* Mostramos el primer premio si existe */}
                <strong>Premio:</strong> {movie.prizes?.[0]?.name || "Sin premios"}
              </p>
            </div>
            
            <Link href={`/peliculas/${movie.id}`}>
              <button style={{ padding: "10px 16px", backgroundColor: "#2563eb", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                Ver Detalle
              </button>
            </Link>
          </div>
        ))}
        {movies.length === 0 && <p>No hay películas registradas en el sistema.</p>}
      </div>
    </div>
  );
}