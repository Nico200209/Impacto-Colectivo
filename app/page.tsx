import Navbar from "@/components/Navbar";
import Inicio from "@/components/sections/Inicio";
import Nosotros from "@/components/sections/Nosotros";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Inicio />
        <Nosotros />
        {/* Next sections will be added here */}
      </main>
    </>
  );
}
