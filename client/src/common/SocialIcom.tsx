import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

import {
  FaWhatsapp,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaInstagram,
} from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

import { IoChatboxEllipses } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaVoicemail } from "react-icons/fa";


export default function SocialMediaIcons() {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const iconsRef = useRef<HTMLAnchorElement[]>([]);

//   setVisible(true);
  // Show button on scroll
  useEffect(() => {
    const handleScroll = () => {
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate icons
  useEffect(() => {
    if (!iconsRef.current.length) return;

    const targets = iconsRef.current.filter(Boolean);

    if (open) {
      gsap.fromTo(
        targets,
        { y: 20, opacity: 0, scale: 0 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
          stagger: 0.1,
        }
      );
    } else {
      gsap.to(targets, {
        y: 20,
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "power1.in",
        stagger: 0.1,
      });
    }
  }, [open]);

  const socialLinks = [
    {
      icon: <MdEmail />,
     
      link:  `https://mail.google.com/mail/?view=cm&fs=1&to=info@alqawan.com&su=التواصل مع مبرة قعوان`,
      color: "bg-[#3A3D6C]",
      size: "60px",
    },
  
    {
      icon: <FaWhatsapp />,
      link: "https://api.whatsapp.com/send?phone=966537410089",
      color: "bg-[#3A3D6C]",
      size: "60px",
    },
  ];

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 flex flex-col items-center space-y-2 z-50">
      {/* Social Icons */}
      {open &&
        socialLinks.map((item, index) => {
          const isMail = item.link.startsWith('mailto:');
          return (
            <a
              key={index}
              href={item.link}
              {...(!isMail && { target: "_blank", rel: "noopener noreferrer" })}
              className={`text-white cursor-pointer rounded-full flex items-center justify-center text-2xl shadow-md ${item.color} w-12 h-12 sm:w-[60px] sm:h-[60px]`}
              title={item.link}
              ref={el => {
                if (el) iconsRef.current[index] = el;
              }}
            >
              {item.icon}
            </a>
          );
        })}

      {/* Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`cursor-pointer p-4 sm:p-7 md:p-7 bg-[#3A3D6C] flex justify-center  items-center text-white rounded-full shadow-lg transition-colors duration-300`}
        aria-label="Toggle Chat"
      >
        {open ? (
          <IoIosCloseCircleOutline size={32} className="sm:w-[38px] sm:h-[38px]" />
        ) : (
          <IoChatboxEllipses size={32} className="sm:w-[38px] sm:h-[38px]" />
        )}
      </button>
 
    </div>
  );
}
