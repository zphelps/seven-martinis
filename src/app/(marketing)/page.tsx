"use client"
import {useAuth} from "@/hooks/useAuth";
import Header from "@/components/marketing/header";
import Hero from "@/components/marketing/hero";
import Pricing from "@/components/marketing/pricing";
import Footer from "@/components/marketing/footer";
import FAQ from "@/components/marketing/faq";
import Testimonials from "@/components/marketing/testimonials";
import Features from "@/components/marketing/features";

export default function Home() {

  const auth = useAuth();

  return (
    <section className={'container'}>
        <Header/>
        <Hero/>
        <Features/>
        <Pricing/>
        <Testimonials/>
        {/*<FAQ/>*/}
        <Footer/>
    </section>
  );
}
