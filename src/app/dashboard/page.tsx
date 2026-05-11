import data from "./components/data/page";
import balance from "./components/balance/page";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-200 text-black p-8 space-y-10">

      <div>
        {data()}
      </div>
        
      <div>

        <div>
          {balance()}
        </div>
        
        <div>

        </div>
        
      </div> 
    </main>
  );
}
