import Navbar from "@/components/Navbar";
import Inicio from "@/components/sections/Inicio";
import Nosotros from "@/components/sections/Nosotros";
import Temas from "@/components/sections/Temas";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Inicio />
        <Nosotros />
        <Temas />
        {/* Next sections will be added here */}
      </main>
    </>
  );
}
