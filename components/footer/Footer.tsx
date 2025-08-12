"use client";
import Facebook from "@/public/icons/facebook.svg";
import Youtube from "@/public/icons/youtube.svg";
import Instagram from "@/public/icons/instagram.svg";
import Pinterest from "@/public/icons/pinterest.svg";
import Twitter from "@/public/icons/x.svg";
import Image from "next/image";
import Link from "next/link";
import { Home, Mail, Phone } from "lucide-react";
import FooterForm from "./FooterForm";

const FollowLinks = [
  {
    img: Facebook,
    alt: "facebook-icon",
    link: "/",
  },
  {
    img: Youtube,
    alt: "youtube-icon",
    link: "/",
  },
  {
    img: Instagram,
    alt: "instagram-icon",
    link: "/",
  },
  {
    img: Pinterest,
    alt: "pinterest-icon",
    link: "/",
  },
  {
    img: Twitter,
    alt: "X-icon",
    link: "/",
  },
];

const contactList = [
  {
    icon: <Home size={16} />,
    title: "University of Sahiwal, Sahiwal, Punjab, Pakistan",
  },
  {
    icon: <Phone size={16} />,
    title: "+92 302 0620626",
  },
  {
    icon: <Mail size={16} />,
    title: "tahsin3194@gmail.com",
  },
];

const links = [
  {
    title: "HomePage",
    link: "/",
  },
  {
    title: "Appointment",
    link: "/appointment",
  },
  {
    title: "Contact Us",
    link: "/contact-us",
  },
  {
    title: "Ai Assistant",
    link: "/assistant",
  },
  {
    title: "Your Profile",
    link: "/profile",
  },
  // {
  //   title: "Terms and Condition",
  //   link: "/terms-&-conditions",
  // },
];

export default function Footer() {
  return (
    <footer className="relative z-0 border-t bg-gray-100 dark:bg-gray-950 text-gray-950 dark:text-gray-100 flex flex-col items-center">
      <div className="max-w-[1920px] w-full">
        {/* Top Section */}
        <div className="px-4 sm:px-6 flex flex-wrap justify-between py-10">
          {/* Contacts */}
          <div className="lg:w-1/3 sm:w-1/2 w-full mb-10 sm:mb-0">
            <div className="flex flex-col justify-between gap-6">
              <h3 className="font-ubuntu text-lg font-bold leading-[22px] tracking-tight text-gray-900 dark:text-gray-100">
                MediTech Medical & <br />
                Healthcare Center
              </h3>
              <div className="flex flex-col gap-3">
                {contactList.map((ele) => (
                  <div key={ele.title} className="flex items-start gap-3">
                    <div className="w-6 h-6 border border-gray-400 rounded-full text-gray-700 dark:text-gray-300 flex items-center justify-center">
                      {ele.icon}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {ele.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="lg:w-1/3 sm:w-1/2 w-full flex sm:justify-center mb-10 sm:mb-0">
            <div className="flex flex-col justify-between gap-3">
              {links.map((ele) => (
                <Link
                  key={ele.title}
                  href={ele.link}
                  className="font-semibold font-roboto text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                >
                  {ele.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Subscribe Form */}
          <div className="lg:w-1/3 w-full">
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-bold font-ubuntu text-2xl leading-7 tracking-tight text-gray-900 dark:text-gray-100">
                  Be Our Subscriber
                </h4>
                <p className="text-sm text-gray-800 dark:text-gray-300">
                  to get the latest news about health from our experts
                </p>
              </div>
              <FooterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-light-4 dark:bg-dark-4 border-t">
        <div className="max-w-[1920px] w-full flex md:gap-9 gap-4 items-center py-4 justify-center px-6 md:flex-row flex-col">
          <div className="flex gap-4 items-center">
            <p className="text-sm text-gray-200">
              Follow Us
            </p>
            <div className="flex gap-3 items-center">
              {FollowLinks.map((ele) => (
                <Link
                  href={ele.link}
                  key={ele.alt}
                  aria-label={ele.alt}
                  className="w-8 h-8 rounded bg-white hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition"
                >
                  <Image src={ele.img} alt={ele.alt} width={18} height={18} />
                </Link>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-200 text-center">
            Copyright © 2025 MediTech, All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
