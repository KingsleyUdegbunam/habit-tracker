"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "@/components/shared/SplashScreen";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();

      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
