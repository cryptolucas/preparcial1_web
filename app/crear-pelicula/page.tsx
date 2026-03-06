import MovieCreationForm from "@/components/MovieCreationForm";

function CrearPeliculaPage() {
  return (
    <div>
      <h1>Crear una Nueva Pelicula</h1>
      {/* Aquí es donde llamas al componente que acabamos de crear */}
      <MovieCreationForm />
    </div>
  );
}

export default CrearPeliculaPage;