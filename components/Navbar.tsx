import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#f0f0f0", marginBottom: "2rem" }}>
      <ul style={{ display: "flex", gap: "2rem", listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/actores">Actores</Link>
        </li>
        <li>
          <Link href="/crear-actor">Crear Actor</Link>
        </li>

        <li>
          <Link href="/crear-pelicula">Crear Pelicula</Link>
        </li>

        <li>
          <Link href="/peliculas">Ver Listado Peliculas</Link>
        </li>

        
      </ul>
    </nav>
  );
}