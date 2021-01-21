import React from "react";
import Link from "next/link";

class Header extends React.Component {
  state = {
    menuOpen: false,
  };

  render() {
    return (
      <div>
        <div className={`h-${this.props.height} absolute p-4 h-36 w-full bg-teal-600 z-0`}>
          <img
            className= {`h-${this.props.height} absolute w-screen top-0 left-0 object-cover opacity-25 z-0`}
            src="/images/bg.png"
          ></img>
        </div>
        <div className="z-40">
          <div className="relative container mx-auto sm:flex">
            <div className="flex items-center justify-between">
              <div className="py-6 px-4">
                <a href="/" className="px-4 font-semibold text-white">
                  <img src="/images/logo-white.svg" className="w-56"></img>
                </a>
              </div>
              <div
                id="mobile-nav-button"
                className="sm:hidden"
                onClick={() =>
                  this.setState({ menuOpen: !this.state.menuOpen })
                }
              >
                <button
                  type="button"
                  className="p-1 text-teal-200 border-2 border-teal-400 rounded-md hover:text-white"
                >
                  <svg
                    className="h-7 w-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* <Transition
                  show={menuOpen}
                  enter="transition-height duration-300 transform"
                  enterFrom="-translate-y-12"
                  enterTo="translate-y-0"
                  leave="transition-height duration-300 transform"
                  leaveFrom="translate-y-0"
                  leaveTo="-translate-y-12"
                > */}
            <div
              className={`${
                !this.state.menuOpen ? "hidden" : "relative"
              } sm:text-teal-100 bg-white rounded-lg sm:block sm:flex sm:w-full sm:items-center sm:bg-transparent sm:justify-between text-teal-600'`}
            >
              <div className="sm:flex sm:justify-start">
                <Link href="/startups">
                  <a className="block px-4 py-4 font-semibold rounded-lg border border-gray-100 hover:bg-gray-100 sm:border-0 sm:py-2 sm:ml-6 sm:hover:bg-teal-500 sm:hover:text-white">
                    Startups
                  </a>
                </Link>
                <Link href="/mentors">
                <a className="block px-4 py-4 font-semibold rounded-lg border border-gray-100 hover:bg-gray-100 sm:border-0 sm:py-2 sm:ml-6 sm:hover:bg-teal-500 sm:hover:text-white"
                >
                  Mentors
                </a>
                </Link>
                <a
                  href="#"
                  className="block px-4 py-4 font-semibold rounded-lg border border-gray-100 hover:bg-gray-100 sm:border-0 sm:py-2 sm:ml-6 sm:hover:bg-teal-500 sm:hover:text-white"
                >
                  Schedules
                </a>
              </div>
              <div className="pr-6">
                <a
                  href="#"
                  className="block px-4 py-4 font-semibold rounded-lg border border-gray-100 hover:bg-gray-100 sm:py-2 sm:ml-6 sm:px-4 sm:border-2 sm:rounded-md sm:hover:bg-white sm:hover:text-teal-200 sm:hover:border-white"
                >
                  Login
                </a>
              </div>
            </div>
            {/* </Transition> */}
          </div>

          {/* <div className="relative block py-28 text-center">
                <h1 className="text-6xl text-white font-bold">EA20 Selection Days</h1>
                <h2 className="py-3 text-2xl text-teal-100 font-light">
                  WED 4TH & THU 5TH DECEMBER
                </h2>
                <p className="py-4 px-4 text-xl text-teal-100">
                  We are delighted to invite you to the first event of
                  Startupbootcamp's 2020 smart energy program. Come and help us select
                  the top 10 teams that will disrupt the energy market.
                </p>
              </div> */}
        </div>
      </div>
    );
  }
}

export default Header;
