"use client";
import Image from "next/image";
import logo from "@/public/images/LOGO.png";
import { ThemeToggler } from "./theme-toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PFP from "@/public/images/PFP.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Btn from "./Button";

function Navbar({ isAuthenticated }: { isAuthenticated: boolean }) {
  const NavLinks = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "Ai Assistant",
      link: "/assistant",
    },
    {
      title: "Find Real Doctor",
      link: "/appointment",
    },
    {
      title: "About Us",
      link: "/about-us",
    },
    {
      title: "Contact",
      link: "/contact-us",
    },
  ];
  const pathname = usePathname();
  const [isNavbarDown, setIsNavbarDown] = useState(false);
  return (
    <header className={`fixed z-10 w-screen h-16 dark:bg-dark-1 bg-light-4  flex justify-center`}>
      <div className="max-w-[1920px] w-full flex items-center justify-between h-full px-2 lg:px-6">
        <div className="absolute -z-10 w-screen h-full dark:bg-dark-1 bg-light-4" />
        {/* LOGO */}
        <Link href="/" className="flex items-center">
          <Image src={logo} width={52} height={52} alt="Logo of MediTech" />
          <h3 className={`text-2xl font-bold font-ubuntu text-white`}>
            MediTech
          </h3>
        </Link>
        {/* NavLinks */}
        <nav>
          <ul
            className={`   lg:relative lg:flex-row lg:w-fit lg:top-0 lg:z-0
                        absolute dark:bg-dark-1 bg-light-4 flex flex-col items-center lg:gap-7 w-screen left-0 ${
                          isNavbarDown ? "top-16" : "-top-60"
                        } transition-all duration-1000 -z-20`}
          >
            {NavLinks.map((ele) => (
              <li key={ele.title} className="py-3">
                <Link
                  href={ele.link}
                  className={`text-[18px] ${
                    pathname === ele.link ? "text-black" : "text-white"
                  } font-roboto font-bold leading-[22px] -tracking-[0.5px]`}
                >
                  {ele.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-4 lg:w-37 w-48 justify-end items-center">
          <div className="lg:hidden">
            <Btn onClick={() => setIsNavbarDown(!isNavbarDown)}>
              {!isNavbarDown ? <Menu /> : <X />}
            </Btn>
          </div>
          {!isAuthenticated && (
            <Link
              href="/login"
              className={`${pathname === "/login" ? "hidden" : "block"}`}
            >
              <Btn onClick={() => {}}>Login</Btn>
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/profile"
              className={`rounded-full w-8 h-8 overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)]`}
            >
              <Image src={PFP} width={32} height={32} alt="profile picture" />
            </Link>
          )}
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
