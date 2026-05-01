import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import LeadForm from '@/components/LeadForm';
import AboutUs from '@/components/AboutUs';
import AboutUsCare from '@/components/AboutUsCare';
import SurgeonsSection from '@/components/SurgeonsSection';
import EnquirySection from '@/components/EnquirySection';



import Services from '@/components/Services';
import FeaturesBar from '@/components/FeaturesBar';
import WhyChooseUs from '@/components/WhyChooseUs';
import TreatmentSection from '@/components/TreatmentSection';
import ResultsSlider from '@/components/ResultsSlider';
import GradeSlider from '@/components/GradeSlider';

export default function Home() {
  return (
    <main>
      <TopBar />
      <Header />
      <div style={{ position: 'relative' }}>
        <HeroSlider />
        <div className="hero-right">
          <LeadForm />
        </div>
      </div>
      <AboutUs />

      <Services />
      <FeaturesBar />
      <TreatmentSection />
      <WhyChooseUs />
      <ResultsSlider />
      <GradeSlider />
      <AboutUsCare />
      <SurgeonsSection />
      <EnquirySection />



    </main>
  );
}
