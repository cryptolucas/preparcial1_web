"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// 1. Importamos la interfaz y las funciones directamente desde el servicio
import { Actor, getActors, deleteActor } from "@/services/api";

function ActorList() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        
        // 2. Usamos el servicio
        const data = await getActors();
        setActors(data); 
      } catch (error) {
        console.error("Error al obtener los actores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActors();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este actor?");
    if (!confirmDelete) return;

    try {
      // 3. Usamos el servicio para eliminar, delegando la lógica de la URL y el método
      await deleteActor(id);
      
      // Si la promesa se resuelve sin errores, actualizamos el estado
      setActors((prevActors) => prevActors.filter((actor) => actor.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al eliminar el actor en el servidor.");
    }
  };

  if (isLoading) return <p>Cargando actores...</p>;
  if (!actors || actors.length === 0) return <p>No se encontraron actores.</p>;

  return (
    <div>
      <h2>Lista de Actores</h2>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {actors.map((actor) => (
          <li key={actor.id} style={{ display: "flex", gap: "1rem", alignItems: "center", border: "1px solid #ccc", padding: "1rem" }}>
            <Image 
              src={actor.photo} 
              alt={`Foto de ${actor.name}`} 
              width={100} 
              height={100}
              unoptimized 
              style={{ objectFit: "cover" }} 
            />
            <div style={{ flex: 1 }}>
              <h3>{actor.name}</h3>
              <p><strong>Nacionalidad:</strong> {actor.nationality}</p>
              <p><strong>Películas:</strong> {actor.movies?.length || 0}</p>
            </div>
            
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href={`/actores/editar/${actor.id}`}>
                <button style={{ padding: "0.5rem 1rem", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px" }}>
                  Editar
                </button>
              </Link>
              
              <button 
                onClick={() => handleDelete(actor.id)} 
                style={{ padding: "0.5rem 1rem", cursor: "pointer", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px" }}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActorList;