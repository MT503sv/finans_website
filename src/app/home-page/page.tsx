
import FirstBlock from "./components/FirstBlock/page";
import SecondBlock from "./components/SecondBlock/page";
import ThirdBlock from "./components/ThirdBlock/page";

export default function HomePage() {
  return (
    <main className="w-full h-full">
      {/* Bloque 1 */}
      <FirstBlock />

      {/* Bloque 2 */}
      <SecondBlock />

      {/*Bloque 3*/}
    <div className="max-w-6xl mx-auto px-6 rounded-3xl overflow-hidden">
      <ThirdBlock/>
    </div>
    </main>
  );
}