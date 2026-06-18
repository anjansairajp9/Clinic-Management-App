"use client";

import { useState, useEffect } from "react";

export function useMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const checkIsMobile = () => {
			setIsMobile(window.innerWidth <= breakpoint);
		};

		checkIsMobile();

		window.addEventListener("resize", checkIsMobile);

		return () => window.removeEventListener("resize", checkIsMobile);
	}, [breakpoint]);

	return isMobile;
}
