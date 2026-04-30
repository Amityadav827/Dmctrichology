import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import LeadForm from '@/components/LeadForm';
import AboutUsCare from '@/components/AboutUsCare';

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
      <AboutUsCare />
    </main>
  );
}
