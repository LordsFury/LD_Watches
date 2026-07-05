import Link from "next/link";
import { SITE_NAME } from "@/lib/brand";
import HeroSection from "@/components/home/HeroSection";
import WatchCard from "@/components/watches/WatchCard";
import FadeIn from "@/components/ui/FadeIn";
import { getWatches } from "@/lib/data";
import { Watch } from "@/types/watch";
import { ArrowRight, Award, Gem, Headphones } from "lucide-react";

export default async function HomePage() {
  let featuredWatches: Watch[] = [];

  try {
    featuredWatches = await getWatches({ featured: true, limit: 4 });
    if (featuredWatches.length === 0) {
      featuredWatches = await getWatches({ limit: 4 });
    }
  } catch {
    featuredWatches = [];
  }

  return (
    <>
      <HeroSection />

      {featuredWatches.length > 0 && (
        <section className="py-16 sm:py-20 bg-ld-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center sm:text-left mb-8 sm:mb-10">
                <h2 className="section-heading mb-2">
                  Featured <span className="text-gradient-gold">Collection</span>
                </h2>
                <p className="text-ld-silver text-sm sm:text-base max-w-lg mx-auto sm:mx-0">
                  Handpicked timepieces for the distinguished
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredWatches.map((watch, index) => (
                <WatchCard key={watch._id} watch={watch} index={index} />
              ))}
            </div>

            <FadeIn delay={0.2}>
              <div className="mt-10 sm:mt-12 flex justify-center">
                <Link
                  href="/watches"
                  className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full glass-panel border border-ld-gold/25 hover:border-ld-gold/50 hover:bg-ld-gold/5 transition-all duration-300"
                >
                  <span className="text-ld-gold-light font-semibold text-sm sm:text-base">
                    View Full Collection
                  </span>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-ld-gold text-[#1a1200] group-hover:bg-ld-gold-light transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      <section id="about" className="py-16 sm:py-20 bg-ld-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="section-heading mb-3 sm:mb-4">
                Why Choose <span className="text-gradient-gold">{SITE_NAME}</span>
              </h2>
              <p className="text-ld-silver max-w-2xl mx-auto text-sm sm:text-base px-2">
                We bring you the finest selection of timepieces with guaranteed authenticity
                and exceptional customer service.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Gem,
                title: "Premium Quality",
                description:
                  "Every watch is carefully selected for its craftsmanship, durability, and timeless design.",
              },
              {
                icon: Award,
                title: "100% Authentic",
                description:
                  "We guarantee the authenticity of every timepiece in our collection with proper documentation.",
              },
              {
                icon: Headphones,
                title: "Expert Support",
                description:
                  "Our team is available via WhatsApp to help you find the perfect watch and answer any questions.",
              },
            ].map((feature, index) => (
              <FadeIn key={feature.title} delay={index * 0.15}>
                <div className="text-center p-6 sm:p-8 glass-panel rounded-2xl gold-glow-hover h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ld-gold/10 mb-5">
                    <feature.icon className="w-7 h-7 text-ld-gold" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3">{feature.title}</h3>
                  <p className="text-ld-silver text-sm leading-relaxed">{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 bg-ld-dark border-t border-ld-grey/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="section-heading mb-3 sm:mb-4">
              Ready to Find Your <span className="text-gradient-gold">Perfect Watch</span>?
            </h2>
            <p className="text-ld-silver mb-6 sm:mb-8 text-sm sm:text-base px-2">
              Browse our collection and reach out via WhatsApp for instant assistance.
              We&apos;re here to help you make the perfect choice.
            </p>
            <Link href="/watches" className="btn-gold px-8 py-3.5 sm:py-4 gold-glow text-sm sm:text-base">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
