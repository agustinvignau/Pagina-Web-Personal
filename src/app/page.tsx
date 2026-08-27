import Hero from "@/components/Hero";
import Produccion from "@/components/Produccion";
import Laboratorio from "@/components/Laboratorio";
import Perfil from "@/components/Perfil";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import DatosEstructurados from "@/components/DatosEstructurados";

export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <DatosEstructurados />
      <Hero />
      <Produccion />
      <Laboratorio />
      <Perfil />
      <Contacto />
      <Footer />
    </main>
  );
}
