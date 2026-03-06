import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "70vh", 
      textAlign: "center" 
    }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
        ¡Bienvenido a tu Gestor de Películas! 
      </h1>
      
      <p style={{ fontSize: "1.2rem", color: "#666", maxWidth: "600px", marginBottom: "2.5rem", lineHeight: "1.6" }}>
        Desde este panel de control podrás administrar toda la información de tus actores, añadir nuevos talentos a tu base de datos y vincularlos con las películas en las que han participado.
      </p>
      
      {/* Botones de acceso rápido */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/actores">
          <button style={{ 
            padding: "0.8rem 1.5rem", 
            cursor: "pointer", 
            backgroundColor: "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "1rem",
            fontWeight: "bold"
          }}>
            Ver Lista de Actores
          </button>
        </Link>
        
        <Link href="/crear-actor">
          <button style={{ 
            padding: "0.8rem 1.5rem", 
            cursor: "pointer", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            fontSize: "1rem",
            fontWeight: "bold",
          }}>
            Añadir Nuevo Actor
          </button>
        </Link>
      </div>
    </div>
  );
}
