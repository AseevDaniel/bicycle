import { HeroSectionClient as HeroSection } from '@/components/home/HeroSectionClient'
import { CategorySection } from '@/components/home/CategorySection'
import { StatsSection } from '@/components/home/StatsSection'
import { FeaturedListings } from '@/components/home/FeaturedListings'
import { HowItWorks } from '@/components/home/HowItWorks'
import { TrustSection } from '@/components/home/TrustSection'
import { RecentListings } from '@/components/home/RecentListings'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <StatsSection />
      <FeaturedListings />
      <RecentListings />
      <HowItWorks />
      <TrustSection />
    </>
  )
}
