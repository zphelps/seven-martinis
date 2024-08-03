"use client"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useAuth} from "@/hooks/useAuth";
import {api} from "@/lib/api";
import Header from "@/components/marketing/header";

export default function Home() {

  const auth = useAuth();

  return (
    <section>
        <Header/>
    </section>
  );
}
