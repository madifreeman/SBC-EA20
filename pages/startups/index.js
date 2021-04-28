import { useState } from "react";
import Link from "next/link";
import groq from "groq";
import client from "@/utils/sanity";
import urlFor from "@/utils/imageUrlBuilder";
import { themes } from "@/utils/themes";

export async function getStaticProps() {
  // SANITY
  const startups = await client.fetch(groq`
      *[_type == "startup"]{name, city, country, description, image, themes, 'slug': slug.current}
    `);
  return {
    props: {
      startups
    },
  };
}

export default function Startups({ startups }) {
  const [filteredStartups, setFilter] = useState(startups);
  const [numStartups, setNumStartups] = useState(startups.length);
  let theme = "All Themes";
  

  function handleThemeChange(e) {
    theme = e.target.value;
    const newfilteredStartups = startups.filter(filterByTheme);
    setFilter(newfilteredStartups);
    setNumStartups(newfilteredStartups.length);
  }

  function filterByTheme(startup) {
    if (theme === "All Themes") return true;
    return startup.themes.includes(theme);
  }

  return (
    <div>
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between -mt-10">
        <div>
          <h1 className="w-full md:w-1/4 text-3xl font-semibold text-gray-700 self-end">
            Startups{" "}
            <span className="font-normal text-gray-400">({numStartups})</span>
          </h1>
        </div>
        <div>
          <label className="block w-64">
            <select
              id="dropdown"
              onChange={handleThemeChange}
              name="theme"
              className="block w-full mt-1 text-gray-700 cursor-pointer border border-gray rounded py-3 pl-3 pr-10"
            >
              {/* TODO: Get below options from DB */}
              <option value="All Themes">All Themes</option>
              {themes.map((theme) => (
                <option value={theme} key={theme}>
                  {theme}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="container mx-auto my-2">
        <div className="flex flex-wrap -m-2 pt-4">
          {filteredStartups.map((startup) => (
            <div
              className="w-full lg:w-1/2 z-0 hover:z-10 p-2"
              key={startup.name}
            >
              <Link href={"/startups/" + startup.slug}>
                <a className="block h-full">
                  <div className="h-full flex flex-wrap items-center px-8 py-8 md:py-12 bg-white shadow hover:shadow-lg group rounded cursor-pointer">
                    <img
                      className="h-32 w-32 mx-auto mb-4 sm:ml-0 sm:mr-8 lg:mr-0 sm:mb-0 p-2 object-cover rounded-full border-gray-200 group-hover:border-teal-500 border-2"
                      src={urlFor(startup.image)}
                    ></img>
                    <div className="w-full sm:w-4/6 lg:pl-8 text-center sm:text-left">
                      <h2 className="text-xl group-hover:text-teal-500 font-semibold">
                        {startup.name}
                      </h2>
                      <p className="text-gray-500">
                        {startup.city + ", " + startup.country}
                      </p>
                      <p className="pt-2">{startup.description}</p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
