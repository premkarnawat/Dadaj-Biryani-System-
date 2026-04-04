export const dynamic = 'force-dynamic';

import HeroSection       from '@/components/home/HeroSection';
import BannerCarousel    from '@/components/home/BannerCarousel';
import CategoriesSection from '@/components/home/CategoriesSection';
import MenuSection       from '@/components/home/MenuSection';
import WhyUsSection      from '@/components/home/WhyUsSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 space-y-6 py-10">
        <BannerCarousel />
        <CategoriesSection />
        <MenuSection />
        <WhyUsSection />
      </div>
    </div>
  );
}
