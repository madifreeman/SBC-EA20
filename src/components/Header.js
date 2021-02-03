import React from "react";
import { HamburgerMenuIcon } from "../../public/icons";
import Link from "next/link";
import { Transition } from "@headlessui/react";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.topBarMenu = this.topBarMenu.bind(this);
    this.hamburgerMenu = this.hamburgerMenu.bind(this);
    this.state = {
      menuOpen: false,
      windowWidth: undefined,
    };

    this.menuItems = [
      {name : "Startups", link: "/startups"},
      {name : "Mentors", link: "/mentors"},
      {name : "Schedule", link: "/#"}
    ]

    // Login button is styled differently in topbar menu, so keep seperate
    this.loginItem = {name: "Login", link: "#"}

  }

  topBarMenu() {
    return (
      <div className="w-full flex items-center">
        <div className="flex-grow block flex w-auto">
          <div className="font-semibold flex-grow">
            {this.menuItems.map((menuItem) => (
              <Link href={menuItem.link}>
              <a
                className="block inline-block mt-0 text-teal-200 hover:bg-teal-500 hover:text-white mx-2 px-4 py-2 rounded hover:shadow-lg "
              >
                {menuItem.name}
              </a>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <a
            href={this.loginItem.link}
            className="block px-4 py-2 font-semibold text-white border-2 border-white rounded inline-block lg:mt-0 hover:bg-white hover:text-teal-600 hover:border-transparent hover:shadow-lg"
          >
            {this.loginItem.name}
          </a>
        </div>
      </div>
    );
  }

  hamburgerMenu() {
    return (
      <Transition
        show={this.state.menuOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <div className="mx-4 bg-white rounded-lg text-teal-600">
          <div className="relative text-gray-800  bg-white rounded-lg text-teal-600">
          {this.menuItems.concat(this.loginItem).map((menuItem) => (
            <Link href={menuItem.link}>
            <a className="block px-4 py-4 font-semibold rounded-lg border border-gray-100 hover:bg-gray-100 ">
              {menuItem.name}
            </a>
            </Link>
          ))}
          </div>
        </div>
      </Transition>
    );
  }

  componentDidMount() {
    // Keep track of window size so as to adjust whether topbar or hamburger menu is used
    // Needs to be done in componentDidMount otherwise window is undefined
    this.setState({ windowWidth: window.innerWidth });
    window.addEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth })
    );
  }

  render() {
    return (
      <div>
        <div
          className={`h-${this.props.height} absolute p-4 h-36 w-full bg-teal-600 z-0`}
        >
          <img
            className={`h-${this.props.height} absolute w-screen top-0 left-0 object-cover opacity-25 z-0`}
            src="/images/bg.png"
          ></img>
        </div>
        <div className="z-40">
          <div className="relative container mx-auto md:flex items-center">
            {/*"md:" for topbarMenu, standard for hamburgerMenu*/}
            <div className="flex items-center justify-between md:justify-start w-full md:w-auto mx-3">
              <div className="py-6 px-4">
                <a href="/" className="px-4 font-semibold text-white">
                  <img src="/images/logo-white.svg" className="w-56"></img>
                </a>
              </div>

              {/* Hamburger menu icon - hidden when window is md or larger */}
              <div
                id="mobile-nav-button"
                className="mx-6 md:hidden"
                onClick={() =>
                  this.setState({ menuOpen: !this.state.menuOpen })
                }
              >
                <button
                  type="button"
                  className="p-1 text-teal-200 border-2 border-teal-400 rounded-md hover:text-white"
                >
                  <HamburgerMenuIcon />
                </button>
              </div>
            </div>

            {/* Using this.state.windowWidth instead of tailwind responsive design because the Transition
                "show" property should only operate when window is small, therefore needed to keep 
                topbar menu and hamburger menu seperate */}
            {this.state.windowWidth !== undefined &&
            this.state.windowWidth > 768
              ? this.topBarMenu()
              : this.hamburgerMenu()}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
