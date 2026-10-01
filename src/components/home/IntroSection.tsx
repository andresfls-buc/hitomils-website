import Image from "next/image";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function IntroSection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Text */}
        <Reveal>
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-[#B8A080] mb-4">
              About the Artist
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#2C2C2C] leading-snug">
              Your Bridal Makeup Artist in Japan
            </h2>
            <div className="mt-5 h-px w-16 bg-[#B8A080]" />
            <p className="mt-8 font-sans text-base text-[#7A7570] leading-relaxed font-light">
              I&apos;m Hitomi, a bridal makeup artist and wedding hairstylist
              based in Sapporo, Hokkaido. With over 12 years of experience
              working with clients from around the world, I create looks
              tailored to your features, your dress and the way you want to
              feel on your wedding day.
            </p>
            <p className="mt-4 font-sans text-base text-[#7A7570] leading-relaxed font-light">
              I work in English and Japanese, so we can plan your bridal look
              together wherever you are travelling from. I serve weddings
              throughout Hokkaido and travel elsewhere in Japan on request,
              subject to availability. Share your date and venue to discuss
              the arrangements and travel costs.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/about" variant="ghost">
                Meet Hitomi
              </Button>
              <Button href="/services" variant="ghost">
                Bridal Services in Japan
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Image */}
        <Reveal delay={0.18}>
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src="/images/about/hitomi-landazabal-bridal-weddings-makeup-sapporo.jpg"
                alt="Hitomi Landazabal, bridal makeup and hair artist in Sapporo, Japan"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#B8A080] -z-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
