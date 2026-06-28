import { HeroSection } from '@/components/landing/hero-section';
import { FeaturesSection, ParametersSection, SystemFlowSection, BenefitsSection, Footer } from '@/components/landing/sections';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-pure-sky/30">
      <HeroSection />
      <FeaturesSection />
      <ParametersSection />
      <SystemFlowSection />
      <BenefitsSection />
      <Footer />
    </main>
  );
}
