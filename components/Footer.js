import {
  InstagramIcon,
  YoutubeIcon,
  LinkedInIcon,
  TwitterIcon,
  FacebookIcon,
} from "@/public/icons";
import { partners } from "@/utils/partners";

const Footer = () => {
  const socialLinks = [
    {
      link: "https://www.facebook.com/sbcAUS",
      icon: <FacebookIcon/>,
    },
    {
      link: "https://twitter.com/sbcenergyaus",
      icon: <TwitterIcon/>
    },
    {
      link: "https://www.linkedin.com/showcase/startupbootcamp-australia/",
      icon: <LinkedInIcon/>,
    },
    {
      link: "https://www.youtube.com/channel/UChzXM1nvKInDPbsYo5jMisg/",
      icon: <YoutubeIcon />,
    },
    {
      link: "https://www.instagram.com/sbcaus/",
      icon: <InstagramIcon />,
    },
  ];

  return (
    <footer>
      <div className="mt-4 p-8 text-center bg-gradient-to-r from-teal-500 to-teal-600">
        <div>
          <h1 className="mt-8 text-white font-bold text-3xl">
            Want to become a mentor at Startupbootcamp?
          </h1>
          <h2 className="mt-5 text-teal-100 text-lg">
            Give back to the startup community by sharing your knowledge and
            experience.
          </h2>
        </div>
        <div className="flex justify-center mt-4">
          <a
            href="#"
            className="btn hover:bg-gray-800 text-white border-white hover:bg-gray-800"
          >
            Learn More
          </a>
          <a
            href="#"
            className="btn hover:bg-gray-800 text-teal-500 bg-white  border-white  hover:text-white"
          >
            Register Now
          </a>
        </div>
      </div>
      <div className="w-full text-white bg-gray-800">
        <div className="container flex flex-wrap items-center justify-between py-16 mx-auto">
          <div className="flex flex-wrap">
            {partners.map((partner) => {
              return (
                <a
                  key={partner.name}
                  className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                  href={partner.link}
                  target="_blank"
                >
                  <img src={partner.image} alt={partner.name} />
                </a>
              );
            })}
          </div>
        </div>
        <div className="py-6 border-t border-gray-700">
          <div className="container flex flex-wrap justify-center items-center py-4 mx-auto md:justify-between md:py-0">
            <p className="mt-4 px-6 text-sm text-gray-500 md:mt-0">
              Copyright © 2019 Startupbootcamp Australia. All rights reserved.
            </p>
            <ul className="flex items-center order-first md:order-last text-gray-500">
              {socialLinks.map((socialLink) => {
                return (
                  <li className="p-2 hover:text-teal-400" key={socialLink.link}>
                    <a href={socialLink.link}>{socialLink.icon}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
