import Footer from "@/components/footer";


export default function AboutUs() {
  return (
    <main className="page">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg text-gray-700 leading-relaxed">
        At Kuali, we are passionate about empowering small businesses to take control of their finances. Our mission is to provide an intuitive and powerful financial management solution that helps entrepreneurs track, understand, and grow their businesses with confidence.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed mt-4">
        Founded in 2024, Kuali was born out of a desire to simplify the complex world of finance for small business owners. We understand the challenges that come with managing cash flow, expenses, and financial planning, which is why we created a platform that combines cutting-edge AI technology with user-friendly design.
      </p>
      <p className="text-lg text-gray-700 leading-relaxed mt-4">
        Our team is made up of experienced professionals in finance, technology, and customer support, all dedicated to helping our users succeed. We are committed to continuous innovation and improvement, ensuring that Kuali remains the go-to financial assistant for small businesses around the world.
      </p>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}