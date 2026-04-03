export const dynamic = 'force-dynamic';
import HeroSection from '@/components/home/HeroSection';
import BannerCarousel from '@/components/home/BannerCarousel';
import BestsellersSection from '@/components/home/BestsellersSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import WhyUsSection from '@/components/home/WhyUsSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 space-y-12 py-12">
        <BannerCarousel />
        <CategoriesSection />
        <BestsellersSection />
        <WhyUsSection />
      </div>
    </div>
  );
}
