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
    title: "About Us",
    link: "/about-us",
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
    title: "Terms and Condition",
    link: "/terms-&-conditions",
  },
];
export default function Footer() {
  return (
    <footer className="relative z-0 bg-light-2 dark:bg-dark-3 dark:text-white flex flex-col items-center">
      <div className="max-w-[1920px] w-full">
        {/* Top Section */}
        <div className=" px-2 sm:px-6 flex flex-wrap justify-between py-10">
          {/* Contacts */}
          <div className="lg:w-1/3 sm:w-1/2 w-full">
            <div className="flex flex-col justify-between gap-10">
              <h3 className="font-ubuntu text-lg font-bold leading-[22px] -tracking-[0.5px] text-black dark:text-white">
                MediTech Medical & <br />
                Healthcare Center
              </h3>
              <div className="flex flex-col gap-2">
                {contactList.map((ele) => (
                  <div key={ele.title} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-600 rounded-full text-white flex items-center justify-center">
                      {ele.icon}
                    </div>
                    <p className="text-base text-gray-600 dark:text-gray-200">
                      {ele.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Links */}
          <div className="lg:w-1/3 flex sm:justify-center sm:w-1/2 w-full mt-10 sm:mt-0">
            <div className="flex flex-col justify-between gap-3">
              {links.map((ele) => (
                <Link
                  key={ele.title}
                  href={ele.link}
                  className="font-semibold font-roboto text-gray-600 dark:text-gray-200 dark:hover:text-white -tracking-[0.5px] hover:text-gray-800"
                >
                  {ele.title}
                </Link>
              ))}
            </div>
          </div>
          {/* Subscribe Form */}
          <div className="lg:w-1/3 lg:mt-0 w-full mt-14">
            <div className="flex flex-col gap-7">
              <div>
                <h5 className="font-bold font-ubuntu text-2xl leading-7 -tracking-[0.5px] text-black dark:text-white">
                  Be Our Subscriber
                </h5>
                <p className="-tracking-[0.5px] text-gray-700 dark:text-gray-200">
                  to get the latest news about health from our experts
                </p>
              </div>
              <FooterForm />
            </div>
          </div>
        </div>
        {/* Bottom Section */}
      </div>
        <div className="w-full bg-light-4 dark:bg-dark-1 flex justify-center">
          <div className="max-w-[1920px] w-full flex md:gap-0 gap-2 items-center py-3 justify-between px-6 md:flex-row flex-col">
            <div className="flex gap-5 items-center justify-center py-0">
              <p className="text-lg text-white">Follow Us</p>
              <div className="flex gap-3 items-center">
                {FollowLinks.map((ele) => (
                  <Link
                    href={ele.link}
                    key={ele.alt}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center"
                  >
                    <Image src={ele.img} alt={ele.alt} width={18} height={18} />
                  </Link>
                ))}
              </div>
            </div>
            <p className="text-white">
              Copyright © 2025 MediTech, All rights reserved
            </p>
          </div>
        </div>
    </footer>
  );
}
