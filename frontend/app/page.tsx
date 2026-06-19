"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/shared/HeroSection";
import FeaturesSection from "@/components/shared/FeaturesSection";

export default function HomePage() {
	return (
		<main className="overflow-hidden">
			<Navbar />

			<HeroSection />

			<FeaturesSection />
		</main>
	);
}
