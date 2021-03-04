import Link from "next/link";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { HamburgerMenuIcon } from "@/public/icons";

function TopBarMenu({ menuItems, loginItem }) {
  return (
    <div className="flex-grow hidden md:block md:flex md:items-end md:w-auto">
      <div className="font-semibold md:flex-grow">
        {menuItems.map((item) => (
          <Link href={item.link} key={item.name}>
            <a className="block mt-4 md:inline-block md:mt-0 text-teal-200 hover:bg-teal-500 hover:text-white mx-2 px-4 py-2 rounded hover:shadow-lg ">
              {item.name}
            </a>
          </Link>
        ))}
      </div>
      <div>
        <Link href={loginItem.link}>
          <a className="block px-4 py-2 mt-4 font-semibold text-white border-2 border-white rounded lg:inline-block lg:mt-0 hover:bg-white hover:text-teal-600 hover:border-transparent hover:shadow-lg">
            {loginItem.name}
          </a>
        </Link>
      </div>
    </div>
  );
}

function HamburgerMenu({ menuItems, loginItem, isMenuOpen }) {
  return (
    <Transition
      show={isMenuOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <div
        id="mobile-nav"
        className="md:hidden w-full mt-8 mb-3 overflow-hidden bg-white rounded-lg"
      >
        <div className="font-semibold">
          {menuItems.concat(loginItem).map((item) => (
            <Link href={item.link} key={item.name}>
              <a className="block px-8 py-4 border-b border-gray-200 hover:bg-gray-200 ">
                {item.name}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Transition>
  );
}

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuItems = [
    { name: "Startups", link: "/startups" },
    { name: "Mentors", link: "/mentors" },
    { name: "Schedule", link: "/#" },
  ];
  const loginItem = { name: "Login", link: "#" };
  return (
    <nav className="py-6">
      <div className="flex flex-wrap items-center justify-between w-full">
        <div className="flex items-center flex-grow-0 flex-shrink-0 w-3/4 pr-6 text-white md:w-auto">
          <div>
          <Link href="/">
            <a className="px-4 font-semibold text-white">
              <img src="/images/logo-white.svg" className="w-56" />
            </a>
          </Link>
          </div>
        </div>

        <TopBarMenu menuItems={menuItems} loginItem={loginItem} />

        <div
          id="mobile-nav-button"
          className="flex justify-end block w-1/4 md:hidden"
        >
          <button
            className="flex items-center p-1 text-teal-200 border-2 border-teal-400 rounded hover:text-white "
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HamburgerMenuIcon />
          </button>
        </div>
      </div>

      <HamburgerMenu
        menuItems={menuItems}
        loginItem={loginItem}
        isMenuOpen={isMenuOpen}
      />
    </nav>
  );
}

export const StandardHeader = () => (
  <header className="relative w-full bg-teal-600 mb-4 px-4 xs:px-8 overflow-hidden">
    <div className="relative container mx-auto z-10">
      <NavBar />
    </div>
    <img
      className="absolute w-screen h-screen top-0 left-0 object-cover opacity-25 z-0"
      src="/images/bg.png"
    />
  </header>
);

export const HomeHeader = () => (
  <header className="relative w-full bg-teal-600 mb-4 px-4 xs:px-8 overflow-hidden">
    <div className="relative container mx-auto z-10">
      <NavBar />
    </div>
    <div className="relative container mx-auto py-12 z-10">
      <div className="md:pt-16 pb-24 md:pb-40 w-full xl:w-3/5 mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
          EA20 Selection Days
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl md:font-thin text-teal-200 leading-tight tracking-wider uppercase">
          Wed 4th &amp; Thu 5th December
        </h2>
        <p className="pt-8 sm:text-xl md:text-2xl text-teal-100">
          We are delighted to invite you to the first event of Startupbootcamp's
          2020 smart energy program. Come and help us select the top 10 teams
          that will disrupt the energy market.
        </p>
      </div>
    </div>
    <img
      className="absolute w-screen h-screen top-0 left-0 object-cover opacity-25 z-0"
      src="/images/bg.png"
    />
  </header>
);
