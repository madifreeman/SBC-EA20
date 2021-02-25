import React from "react";
import { RightArrow } from "../public/icons";

export default function Home() {
  return (
    <div>
      <div className="relative block pt-32 pb-40 text-center">
        <h1 className="text-6xl text-white font-bold">EA20 Selection Days</h1>
        <h2 className="py-3 text-2xl text-teal-100 font-light">
          WED 4TH & THU 5TH DECEMBER
        </h2>
        <p className="py-4 px-4 text-xl text-teal-100">
          We are delighted to invite you to the first event of Startupbootcamp's
          2020 smart energy program. Come and help us select the top 10 teams
          that will disrupt the energy market.
        </p>
      </div>
      <div className="relative flex flex-wrap -mt-24 -m-2 z-40">
        <div className="p-4 w-full lg:w-1/3">
          <div className="px-4 py-8 h-full m-3 bg-white rounded-lg shadow-2xl text-center">
            <div className="text-teal-500 flex justify-around">
              <svg
                className="h-16 w-16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="py-3 text-teal-700 text-2xl font-semibold">
              Want to attend?
            </h2>
            <h3 className="py-2 text-lg">
              Sign up today and be part of this unique experience.
            </h3>
            <div className="py-2 text-teal-500 font-semibold text-lg flex items-center justify-center">
              <a href="/startups" className="pr-1">Register Now</a>
              <RightArrow width="4"/>
            </div>
          </div>
        </div>
        <div className="p-4 w-full md:w-1/2 lg:w-1/3">
          <div className="px-4 py-8 h-full m-3 bg-white rounded-lg shadow-2xl text-center">
            <div className="text-teal-500 flex justify-around">
              <svg
                className="h-16 w-16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h2 className="py-3 text-gray-700 text-2xl font-semibold">
              Our Startups
            </h2>
            <h3 className="py-2 text-lg">
              After receiving 1000+ applications worldwide, these are the 20
              finalists.
            </h3>
            <div className="py-2 text-teal-500 font-semibold text-lg flex items-center justify-center">
              <a href="/startups" className="pr-1">View Startups</a>
              <RightArrow width="4"/>
            </div>
          </div>
        </div>
        <div className="p-4 w-full md:w-1/2 lg:w-1/3">
          <div className="px-4 py-8 h-full m-3 bg-white rounded-lg shadow-2xl text-center">
            <div className="text-teal-500 flex justify-around">
              <svg
                className="h-16 w-16"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  fill="#fff"
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
            </div>
            <h2 className="py-3 text-gray-700 text-2xl font-semibold">
              Our Mentors
            </h2>
            <h3 className="py-2 text-lg">
              Meet the most experienced leaders in the smart energy industry.
            </h3>
            <div className="py-2 text-teal-500 font-semibold text-lg flex items-center justify-center">
              <a href="/mentors" className="pr-1">View Mentors</a>
              <RightArrow width="4"/>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:flex py-8">
        <div className="lg:w-3/4 mb-6 px-8">
          <h2 className="font-semibold text-teal-500 text-lg">
            About Selection Days
          </h2>
          <div className="w-20 h-1 mt-2 bg-teal-500"></div>
          <div className="font-light">
            <h1 className="py-1.5 text-3xl leading-relaxed">
              We’ve scoured the globe, met and mentored the top energy startups
              across 26 cities in 5 continents.
            </h1>
            <div className="py-2 leading-loose">
              <p>
                The top 20 most disruptive energy teams from around the world
                are coming to Melbourne for Startupbootcamp’s Selection Days.{" "}
              </p>
              <p className="py-1">
                During this incredible 2-day event, we will be calling upon 100+
                industry experts, mentors and partners to help select the final
                teams. They will listen, give feedback and mentor all of the
                teams. They will also help us choose which of the teams will be
                selected to join our program in January 2020. We will announce
                the final top 10 teams on the afternoon of 5th December,
                followed by drinks and networking. We look forward to seeing you
                there!
              </p>
            </div>
          </div>
          <a href="#" className="text-lg text-teal-500 font-semibold flex items-center">
            <h2 className="pr-1">View Startups </h2>
            <RightArrow width="4"/>
          </a>
        </div>
        <div className="px-8">
          <img
            src="/images/sbc-home-2.png"
            className="w-full h-full object-cover rounded-lg"
            alt=""
          ></img>
        </div>
      </div>
    </div>
  );
}
