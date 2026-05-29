
import FirstBlock from "../home-page/components/FirstBlock/page";
import SecondBlock from "../home-page/components/SecondBlock/page";
import ThirdBlock from "../home-page/components/ThirdBlock/page";
import FourthBlock from "../home-page/components/FourthBlock/page";
import FifthBlock from "../home-page/components/FifthBlock/page";

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