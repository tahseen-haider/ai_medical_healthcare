"use client";
import Image from "next/image";
import logo from "@/public/LOGO.png";
import { ThemeToggler } from "./theme-toggler";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import PFP from "@/public/PFP.png"

function Navbar({isAuthenticated}: {isAuthenticated: boolean}) {
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
  return (
    <header
      className={`fixed w-screen h-16 dark:bg-[#317BC4] bg-[#3CA4FF] flex items-center justify-between px-6`}
    >
      <Link href="/" className="flex items-center">
        <Image src={logo} width={52} height={52} alt="Logo of MediTech" />
        <h3 className={`text-2xl font-bold font-ubuntu text-white`}>
          MediTech
        </h3>
      </Link>
      <nav>
        <ul className="flex gap-7">
          {NavLinks.map((ele) => (
            <li key={ele.title}>
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
      <div className="flex gap-4 w-37 justify-end items-center">
        {!isAuthenticated && (
          <Link
            href="/login"
            className={`${pathname === "/login" ? "hidden" : "block"}`}
          >
            <Button className="bg-white hover:bg-gray-100 text-black shadow-[0_0_6px_rgba(0,0,0,0.4)]">
              Login
            </Button>
          </Link>
        )}
        {isAuthenticated && (
          <Link
            href="/profile"
            className={`rounded-full w-8 h-8 overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)]`}
          >
            <Image src={PFP} width={32} height={32} alt="profile picture"/>
          </Link>
        )}
        <ThemeToggler />
      </div>
    </header>
  );
}

export default Navbar;
