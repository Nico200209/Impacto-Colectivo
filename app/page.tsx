import Navbar from "@/components/Navbar";
import Inicio from "@/components/sections/Inicio";
import Nosotros from "@/components/sections/Nosotros";
import Temas from "@/components/sections/Temas";
import Encuestas from "@/components/sections/Encuestas";
import Informes from "@/components/sections/Informes";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Inicio />
        <Nosotros />
        <Temas />
        <Encuestas />
        <Informes />
        {/* Next sections will be added here */}
      </main>
    </>
  );
}
