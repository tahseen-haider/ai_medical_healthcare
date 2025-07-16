"use client";
import Image from "next/image";
import logo from "@/public/images/LOGO.png";
import { ThemeToggler } from "./theme-toggler";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Btn from "../Button";
import ProfileButton from "./ProfileButton";
import NotificationsButton from "./NotificationsButton";
import { UserType } from "@/lib/definitions";

function Navbar({ user }: { user?: UserType }) {
  const role = user?.role;
  const userNavLinks = [
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
    // {
    //   title: "About Us",
    //   link: "/about-us",
    // },
    {
      title: "Contact Us",
      link: "/contact-us",
    },
  ];
  const emptyLinks: [] = [];
  const isActiveLink = (pathname: string, link: string) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname === link || pathname.startsWith(`${link}/`);
  };

  const pathname = usePathname();
  const [isNavbarDown, setIsNavbarDown] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const hideLinks =
    mounted &&
    /^\/(login|signup|verify-email(\/.*)?|reset-password(\/.*)?)$/.test(
      pathname
    );

  const isAdmin = role === "admin";
  const isDoctor = role === "doctor";

  return (
    <header
      className={`fixed z-30 w-screen h-14 sm:h-16 dark:bg-dark-4 bg-light-4  flex justify-center border-b-2`}
    >
      <div className="max-w-[1920px] w-full flex items-center justify-between h-full px-2 lg:px-6">
        <div className="absolute -z-10 w-screen h-full left-0 dark:bg-dark-4 bg-light-4" />
        {/* LOGO */}
        <Link
          href={`${
            isAdmin ? "/admin/dashboard" : isDoctor ? "/doctor/dashboard" : "/"
          }`}
          className="flex items-center"
        >
          <Image src={logo} width={52} height={52} alt="Logo of MediTech" />
          <h3 className={`text-2xl font-bold font-ubuntu text-white`}>
            MediTech
          </h3>
        </Link>
        {/* UserNavLinks */}
        {!hideLinks && (
          <nav>
            <ul
              className={`   lg:relative lg:flex-row lg:w-fit lg:top-0 lg:z-0
                        absolute dark:bg-dark-4 bg-light-4 flex flex-col items-center lg:gap-7 w-screen left-0 ${
                          isNavbarDown ? "top-14" : "-top-60"
                        } transition-all duration-300 -z-20`}
            >
              {isAdmin
                ? emptyLinks
                : isDoctor
                ? emptyLinks
                : userNavLinks.map((ele) => (
                    <li key={ele.title} className="py-3">
                      <Link
                        onClick={() => {
                          setIsNavbarDown(false);
                        }}
                        href={ele.link}
                        className={`text-[18px] ${
                          isActiveLink(pathname, ele.link)
                            ? "text-white dark:text-gray-300 border-b-4 border-white dark:border-gray-300 pb-1 font-bold"
                            : "text-white hover:border-b-[1px] pb-[6px] border-gray-200 dark:border-gray-300 "
                        } font-roboto leading-[22px] -tracking-[0.5px]`}
                      >
                        {ele.title}
                      </Link>
                    </li>
                  ))}
              {/* Theme toggeler for smaller screens */}
              <div className="sm:hidden p-2 border-t-2 w-full flex justify-center items-center">
                <div className="text-[18px] text-white  flex gap-4 items-center justify-center font-roboto font-bold leading-[22px] -tracking-[0.5px]">
                  Toggle Theme:
                  <ThemeToggler />
                </div>
              </div>
            </ul>
          </nav>
        )}

        <div className="flex gap-4 lg:w-37 w-48 justify-end items-center">
          {isNavbarDown && (
            <div
              className="absolute top-0 left-0 w-full h-screen backdrop-blur-sm -z-30"
              onClick={() => setIsNavbarDown(false)}
            />
          )}
          {role && <NotificationsButton user={user} />}
          {/* Auth Button */}
          {!role && (
            <Link
              href="/login"
              className={`${
                pathname === "/login" || pathname === "/signup"
                  ? "hidden"
                  : "block"
              }`}
            >
              <Btn
                onClick={() => {}}
                className="bg-light-1 hover:text-white text-black"
              >
                Get Started
              </Btn>
            </Link>
          )}
          {/* Profile Button */}
          {role && <ProfileButton user={user} />}
          <div className="hidden sm:block">
            <ThemeToggler />
          </div>
          {/* Menu Button for smaller screens */}
          <div className="lg:hidden">
            <Btn
              onClick={() => setIsNavbarDown(!isNavbarDown)}
              className="text-black hover:text-white bg-white"
            >
              {!isNavbarDown ? <Menu /> : <X />}
            </Btn>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
