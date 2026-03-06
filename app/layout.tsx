import Navbar from "@/components/Navbar";

// Agregamos la definición del tipo para 'children'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main style={{ padding: "0 2rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
