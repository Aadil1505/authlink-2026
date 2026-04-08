import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider"
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur"

const brands = [
  {
    name: "Nike",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="140 480 790 250" className="h-5 w-auto" fill="currentColor">
        <path d="M245.8075 717.62406c-29.79588-1.1837-54.1734-9.3368-73.23459-24.4796-3.63775-2.8928-12.30611-11.5663-15.21427-15.2245-7.72958-9.7193-12.98467-19.1785-16.48977-29.6734-10.7857-32.3061-5.23469-74.6989 15.87753-121.2243 18.0765-39.8316 45.96932-79.3366 94.63252-134.0508 7.16836-8.0511 28.51526-31.5969 28.65302-31.5969.051 0-1.11225 2.0153-2.57652 4.4694-12.65304 21.1938-23.47957 46.158-29.37751 67.7703-9.47448 34.6785-8.33163 64.4387 3.34693 87.5151 8.05611 15.898 21.86731 29.6684 37.3979 37.2806 27.18874 13.3214 66.9948 14.4235 115.60699 3.2245 3.34694-.7755 169.19363-44.801 368.55048-97.8366 199.35686-53.0408 362.49439-96.4029 362.51989-96.3672.056.046-463.16259 198.2599-703.62654 301.0914-38.08158 16.2806-48.26521 20.3928-66.16827 26.6785-45.76525 16.0714-86.76008 23.7398-119.89779 22.4235z" />
      </svg>
    ),
  },
  {
    name: "LVMH",
    svg: (
      <svg viewBox="0 0 120 30" className="h-5 w-auto" fill="currentColor" aria-label="LVMH">
        <text x="0" y="24" fontFamily="serif" fontWeight="700" fontSize="26" letterSpacing="4">LVMH</text>
      </svg>
    ),
  },
  {
    name: "Rolex",
    svg: (
      <svg viewBox="0 0 120 30" className="h-5 w-auto" fill="currentColor" aria-label="Rolex">
        <text x="0" y="24" fontFamily="serif" fontWeight="600" fontSize="26" letterSpacing="2">ROLEX</text>
      </svg>
    ),
  },
  {
    name: "Gucci",
    svg: (
      <svg viewBox="0 0 110 30" className="h-5 w-auto" fill="currentColor" aria-label="Gucci">
        <text x="0" y="24" fontFamily="serif" fontWeight="600" fontSize="26" letterSpacing="2">GUCCI</text>
      </svg>
    ),
  },
  {
    name: "Prada",
    svg: (
      <svg viewBox="0 0 110 30" className="h-5 w-auto" fill="currentColor" aria-label="Prada">
        <text x="0" y="24" fontFamily="serif" fontWeight="600" fontSize="26" letterSpacing="2">PRADA</text>
      </svg>
    ),
  },
  {
    name: "Adidas",
    svg: (
      <svg viewBox="0 0 130 30" className="h-5 w-auto" fill="currentColor" aria-label="Adidas">
        <text x="0" y="24" fontFamily="sans-serif" fontWeight="700" fontSize="24" letterSpacing="1">adidas</text>
      </svg>
    ),
  },
  {
    name: "Hermès",
    svg: (
      <svg viewBox="0 0 140 30" className="h-5 w-auto" fill="currentColor" aria-label="Hermès">
        <text x="0" y="24" fontFamily="serif" fontWeight="600" fontSize="24" letterSpacing="3">HERMÈS</text>
      </svg>
    ),
  },
  {
    name: "New Balance",
    svg: (
      <svg viewBox="0 0 55 45" className="h-7 w-auto" fill="currentColor" aria-label="New Balance">
        <text x="2" y="20" fontFamily="sans-serif" fontWeight="900" fontSize="18">NB</text>
        <text x="0" y="38" fontFamily="sans-serif" fontWeight="400" fontSize="10" letterSpacing="0.5">NEW BALANCE</text>
      </svg>
    ),
  },
  {
    name: "Supreme",
    svg: (
      <svg viewBox="0 0 155 30" className="h-5 w-auto" fill="currentColor" aria-label="Supreme">
        <text x="0" y="24" fontFamily="sans-serif" fontWeight="800" fontSize="24" letterSpacing="1">SUPREME</text>
      </svg>
    ),
  },
]

export function LogoCloud() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row">

          {/* Label */}
          <div className="shrink-0 md:w-44 md:border-r md:border-border md:pr-6">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground md:text-right">
              Example Brands
            </p>
          </div>

          {/* Slider */}
          <div className="relative w-full overflow-hidden md:flex-1">
            <InfiniteSlider speed={50} speedOnHover={25} gap={96}>
              {brands.map(({ name, svg }) => (
                <div
                  key={name}
                  className="flex shrink-0 items-center text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  {svg}
                </div>
              ))}
            </InfiniteSlider>

            {/* Edge fades */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent" />
            <ProgressiveBlur className="absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
            <ProgressiveBlur className="absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
          </div>

        </div>
      </div>
    </div>
  )
}
