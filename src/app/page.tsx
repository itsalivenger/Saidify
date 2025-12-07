import Hero from "@/components/Hero/Hero";
import FeaturedProducts from "@/components/FeaturedProducts/FeaturedProducts";
import CategoriesGrid from "@/components/CategoriesGrid/CategoriesGrid";
import BestSellers from "@/components/BestSellers/BestSellers";
import NewArrivals from "@/components/NewArrivals/NewArrivals";
import PromoBanner from "@/components/PromoBanner/PromoBanner";
import Testimonials from "@/components/Testimonials/Testimonials";
import Brands from "@/components/Brands/Brands";
import Newsletter from "@/components/Newsletter/Newsletter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between">
      <Hero />
      <Brands />
      <FeaturedProducts />
      <CategoriesGrid />
      <BestSellers />
      <NewArrivals />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
