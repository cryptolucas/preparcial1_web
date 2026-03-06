"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ActorEditForm from "@/components/ActorEditForm";
// Importamos la función y la interfaz del servicio
import { getActorById, Actor } from "@/services/api"; 

function EditarActorPage() {
  const params = useParams(); 
  const id = params.id as string;

  const [actor, setActor] = useState<Actor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        // Obtenemos los datos del Actor
        const data = await getActorById(id);
        setActor(data);
      } catch (error) {
        console.error("Error al obtener el actor:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchActor();
  }, [id]);

  if (isLoading) return <p>Cargando datos del actor...</p>;
  if (!actor) return <p>No se encontró el actor.</p>;

  return (
    <div>
      <h1>Editar Actor</h1>
      <ActorEditForm actor={actor} />
    </div>
  );
}

export default EditarActorPage;