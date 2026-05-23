import Image from "next/image";

export default function FirstBlock() {
  return (
    <div className="font-sans">
        <div>

            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                <h1>Understand your</h1>
                <div className="flex gap-2">
                    <h1>money.</h1>
                    <h1 className="text-blue-950">Grow your</h1>
                </div>
                    <h1 className="text-blue-950">bussiness.</h1>
            </div>

            <h1 className="text-sm sm:text-base md:text-lg max-w-md mt-4">
                Finans helps you track income and expenses,
                see what matters, and make better financial
                decisions with confidence.
            </h1>

            <div className="mt-6">
                <button className="bg-blue-950 text-white px-4 py-2 rounded-md hover:bg-blue-800 w-full sm:w-auto">
                    Start for free
                </button>
            </div>


            <div className="flex mt-8">

                {/*Icon 1 */}
                <div className="flex" >
                    <div>
                    <Image src="/homepage/Mini-icon-3.png" alt="Description of the image" width={40} height={40} />
                    </div>
                    
                    <div className="ml-2">
                        <section className="">
                            <h1 className="font-semibold">Easy to use</h1>
                        </section>

                        <section>
                            <h2 className="text-sm">No financial knowledge needed</h2>
                        </section>
                    </div>
                </div>

                {/*Icon 2 */}
                <div>

                </div>

                {/*Icon 3 */}
                <div>

                </div>

            </div>

      </div>

      <div>
        
      </div>
      
    </div>
  );
}