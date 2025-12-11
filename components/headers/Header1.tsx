"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedButton from "../animation/AnimatedButton";
import { usePathname } from "next/navigation";
import ThemeSwitcherButton from "./ColorSwitcher";

export default function Header1() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsHidden(currentScrollPos > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header id="header" className={`mxd-header ${isHidden ? "is-hidden" : ""}`}>
      {/* header logo */}
      <div className="mxd-header__logo loading__fade">
        <Link href={`/`} className="mxd-logo">
          {/* logo image */}
          <Image
            src="/img/logo.png"
            alt="David Morales Vega"
            width={56}
            height={56}
            className="mxd-logo__image"
            priority
          />
          {/* logo text */}
          <span className="mxd-logo__text">
            David
            <br />
            MV
          </span>
        </Link>
      </div>
      {/* header controls */}
      <div className="mxd-header__controls loading__fade">
        <ThemeSwitcherButton />

        <AnimatedButton
          text="Hablemos"
          className="btn btn-anim btn-default btn-mobile-icon btn-outline slide-right"
          href="/contacto"
        >
          <i className="ph-bold ph-arrow-up-right" />
        </AnimatedButton>
      </div>
    </header>
  );
}
