import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { Why } from "@/components/why"
import { UseCases } from "@/components/use-cases"
import { Pricing } from "@/components/pricing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Why />
        <UseCases />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
