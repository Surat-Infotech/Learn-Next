import HomePageBannerSection from '../HomeBanner';
// import HomePageFollowUsSection from "../HomeFollowUs"
import HomeFollowUsSection from '../HomeFollowUs';
import HomePageFeatureSection from '../HomeFeature';
import HomePageFineJewellery from '../HomeFineJewellery';
import HomePageDiamondBuying from '../HomeDiamondBuying';
import HomePageEngagementRing from '../HomeEngagementRing';
import HomePageCustomisableShape from '../HomeCustomisableShape';
import HomePageShopEngagementRing from '../HomeShopEngagementRing';

export default function HomePageList() {
  return (
    <>
      <HomePageBannerSection />
      <HomePageShopEngagementRing />
      <HomePageCustomisableShape />
      <HomePageFineJewellery />
      <HomePageEngagementRing />
      <HomePageDiamondBuying />
      <HomePageFeatureSection />
      <HomeFollowUsSection />
    </>
  );
}
