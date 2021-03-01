import { useState } from "react";
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { HamburgerMenuIcon } from "@/public/icons";

const TopBarMenu = ({ menuItems, loginItem }) => (
  <div className="flex items-center px-4">
    <div className="flex flex-grow block w-auto">
      <div className="flex-grow font-semibold">
        {menuItems.map((menuItem) => (
          <Link href={menuItem.link} key={menuItem.name}>
            <a className="block inline-block px-4 py-2 mx-2 mt-0 text-teal-200 rounded hover:bg-teal-500 hover:text-white hover:shadow-lg ">
              {menuItem.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
    <div className="flex justify-end">
      <a
        href={loginItem.link}
        className="block inline-block px-4 py-2 font-semibold text-white border-2 border-white rounded lg:mt-0 hover:bg-white hover:text-teal-600 hover:border-transparent hover:shadow-lg"
      >
        {loginItem.name}
      </a>
    </div>
  </div>
);

const HamburgerMenu = ({ menuItems, loginItem, isMenuOpen, setIsMenuOpen }) => (
  <div className="bg-white rounded-lg shadow-lg mx-2 -mt-4 mb-2">
    <Transition
      show={isMenuOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <div className="text-teal-600 bg-white rounded-lg">
        <div className="relative text-gray-800 text-teal-600 bg-white rounded-lg divide-y divide-gray-200 ">
          {menuItems.concat(loginItem).map((menuItem) => (
            <Link href={menuItem.link} key={menuItem.name}>
              <a
                className="block px-4 py-4 font-semibold hover:bg-gray-100 "
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {menuItem.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Transition>
  </div>
);

const Header = ({ height }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Startups", link: "/startups" },
    { name: "Mentors", link: "/mentors" },
    { name: "Schedule", link: "/#" },
  ];

  const loginItem = { name: "Login", link: "#" };

  return (
    <div>
      <div className={`h-${height} absolute p-4 h-36 w-full bg-teal-600 z-0`}>
        <img
          className={`h-${height} absolute w-screen top-0 left-0 object-cover opacity-25 z-0`}
          src="/images/bg.png"
          alt=""
        />
      </div>
      <div className="z-40">
        <div className="container relative items-center mx-auto md:flex">
          {/* "md:" for topbarMenu, standard for hamburgerMenu */}
          <div className="flex items-center justify-between w-full mx-3 md:justify-start md:w-auto">
            <div className="px-4 py-6">
              <Link href="/">
                <a
                  className="px-4 font-semibold text-white"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <img src="/images/logo-white.svg" className="w-56" />
                </a>
              </Link>
            </div>

            {/* Hamburger menu icon - hidden when window is md or larger */}
            <div
              id="mobile-nav-button"
              className="mx-6 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <button
                type="button"
                className="p-1 text-teal-200 border-2 border-teal-400 rounded-md hover:text-white"
              >
                <HamburgerMenuIcon />
              </button>
            </div>
          </div>
          <div className="hidden md:block w-full justify-between">
            <TopBarMenu menuItems={menuItems} loginItem={loginItem} />
          </div>
          <div className="block md:hidden">
            <HamburgerMenu
              menuItems={menuItems}
              loginItem={loginItem}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;