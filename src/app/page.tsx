import Hero from "@/components/Hero";
import Produccion from "@/components/Produccion";

export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <Hero />
      <Produccion />
    </main>
  );
}
