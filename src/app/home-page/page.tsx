
import FirstBlock from "./components/FirstBlock/page";
import SecondBlock from "./components/SecondBlock/page";
import ThirdBlock from "./components/ThirdBlock/page";
import FourthBlock from "./components/FourthBlock/page";
import FifthBlock from "./components/FifthBlock/page";

export default function HomePage() {
  return (
    <main className="w-full h-full">
      {/* Bloque 1 */}
      <FirstBlock/>

      {/* Bloque 2 */}
      <SecondBlock/>

      {/*Bloque 3*/}
    
      <ThirdBlock/>

      {/*Bloque 4*/}
      <FourthBlock/>

      {/*Bloque 5*/}
      <FifthBlock/>

    </main>
  );
}