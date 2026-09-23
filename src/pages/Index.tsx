import InAppBrowserBanner from "@/components/InAppBrowserBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import AboutSection from "@/components/AboutSection";
import ProductLinesSection from "@/components/ProductLinesSection";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import WhyCoplastSection from "@/components/WhyCoplastSection";
import CatalogSection from "@/components/CatalogSection";
import B2BSegmentsSection from "@/components/B2BSegmentsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import CartFab from "@/components/catalog/CartFab";

const Index = () => (
  <>
    <InAppBrowserBanner />
    <Navbar />
    <main>
      <HeroSection />
      <TrustBar />
      <AboutSection />
      <ProductLinesSection />
      <WhyCoplastSection />
      <B2BSegmentsSection />
      <CatalogSection />
      <ProductCatalog />
      <ContactSection />
    </main>
    <Footer />
    <WhatsAppFAB />
    <CartFab />
  </>
);

export default Index;
