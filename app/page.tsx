import Navbar from "@/components/Navbar";
import Inicio from "@/components/sections/Inicio";
import Impacto from "@/components/sections/Impacto";
import Temas from "@/components/sections/Temas";
import Encuestas from "@/components/sections/Encuestas";
import Informes from "@/components/sections/Informes";
import Videos from "@/components/sections/Videos";
import QuienesSomos from "@/components/sections/QuienesSomos";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Inicio />
        <Impacto />
        <Temas />
        <Encuestas />
        <Informes />
        <Videos />
        <QuienesSomos />
        {/* Contacto section coming next */}
      </main>
    </>
  );
}
