import HeroSection from "@/components/home/HeroSection";
import ManifestoSection from "@/components/home/ManifestoSection";
import ExperienceSection from "@/components/home/ExperienceSection";
import GallerySection from "@/components/home/GallerySection";
import EventsSection from "@/components/home/EventsSection";
import MerchSection from "@/components/home/MerchSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import FooterSection from "@/components/home/FooterSection";

export default function Home() {
  return (
    <main className="bg-black">
      <HeroSection />
      {/* <ManifestoSection />*/}
      {/* <ExperienceSection />*/}
      {/* <GallerySection />*/}
      {/* <EventsSection />*/}
      {/* <div id="store">
        <MerchSection />
      </div>*/}
      {/* <NewsletterSection />*/}
      <FooterSection />
    </main>
  );
}
