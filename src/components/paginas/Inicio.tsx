import Hero from "@/components/Hero";
import Produccion from "@/components/Produccion";
import Laboratorio from "@/components/Laboratorio";
import Perfil from "@/components/Perfil";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import DatosEstructurados from "@/components/DatosEstructurados";
import type { Lang } from "@/lib/i18n";

export default function Inicio({ lang }: { lang: Lang }) {
  return (
    <main>
      <DatosEstructurados />
      <Hero lang={lang} />
      <Produccion lang={lang} />
      <Laboratorio lang={lang} />
      <Perfil lang={lang} />
      <Contacto lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
