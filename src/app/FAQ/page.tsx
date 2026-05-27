
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

const items = [
  {
    value: "alerts",
    trigger: "What kind of alerts does the AI provide?",
    content:
      "The AI provides alerts about expenses, unusual movements, risks, and financial recommendations.",
  },
  {
    value: "AI",
    trigger: "How does the AI assisstant help my bussiness?",
    content:
      "It helps automate financial analysis, identify risks, and improve business decisions",
  },
  {
    value: "cancel",
    trigger: "Do I need accounting knowledge to use the platform?",
    content:
      "No, you don’t need accounting knowledge. Finans is designed for you to manage your finances in a simple way without technical terms and complicated functions; each section is designed to be easy to understand.",
  },
  {
    value: "usage",
    trigger: "Is it easy to use?",
    content:
    "Yes. Everything is designed with a clean and simple interface."
  },
  {
    value: "OCR",
    trigger: "What is the OCR scaning?",
    content:
    "The OCR scaning is a feature that allows you to take a picture of your notes and turns he into digital information."
  },
  {
    value: "management",
    trigger: "Can I manage more than money?",
    content:
    "Yes, with Finans you can control more than just money. The platform lets you organize your entire business in one place because you can manage your products, store your supplier information, and set goals with your team. It also helps you take photos of your paper notes and transfer them directly to your phone, and even allows you to manage up to three different businesses from the same account."
  },
]



export default function FAQs() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-14">

      
      <div className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-[#010221] leading-tight">
          Frequently Asked
        </h1>

        <h1 className="text-6xl font-extrabold text-[#C2D4FF]">
          Questions
        </h1>

        <p className="text-[#101010] mt-4 text-sm">
          Do you need some help with something or do you have questions on some features?
        </p>
      </div>

      
      <Card className="w-full max-w-3xl bg-white rounded-2xl  py-8">

        <CardContent>
          <Accordion
            type="single"
            collapsible
            defaultValue="plans"
            className="w-full"
          >
            {items.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="border-b-2 border-[#dbe4ff]"
              >
                <AccordionTrigger className="py-5 text-[15px] font-medium text-[#111827] hover:no-underline">
                  {item.trigger}
                </AccordionTrigger>

                <AccordionContent className="text-gray-700 leading-7 pb-5">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

    
      <div className="text-center mt-20">
        <h2 className="text-4xl font-bold text-[#010221]">
          Have any other questions?
        </h2>

        <p className="text-[#101010] mt-3">
          Don’t hesitate to send us an email with your inquiry or statement at:
        </p>

        <div className="mt-6 bg-white shadow-md rounded-xl px-5 py-3 inline-flex items-center gap-4">
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=finans.expotech@gmail.com"target="_blank"rel="noopener noreferrer">finans.expotech@gmail.com</a>


        </div>
        
      </div>
      

    </main>
    
  )
}