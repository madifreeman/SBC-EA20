import Startup from "../src/components/Startup";
import React, { useState } from "react";
import { q, client } from "../src/fauna";

export async function getStaticProps() {
  // retrieve records from FaunaDB 
  const results = await client
    .query(
      q.Map(
        q.Paginate(q.Documents(q.Collection("Startups"))),
        q.Lambda("startupRef", q.Let(
          {
            startupDoc: q.Get(q.Var("startupRef"))
          }, 
          {
            id: q.Select(["ref", "id"], q.Var("startupDoc")),
            name: q.Select(["data", "name"], q.Var("startupDoc")),
            city: q.Select(["data", "city"], q.Var("startupDoc")),
            country: q.Select(["data", "country"], q.Var("startupDoc")),
            description: q.Select(["data", "description"], q.Var("startupDoc")),
            themes: q.Select(["data", "themes"], q.Var("startupDoc")),
            image: q.Select(["data", "image"], q.Var("startupDoc")),
            slug: q.Select(["data", "slug"], q.Var("startupDoc")),
          }
        ))
      )
    )

  const startups = results.data

  return {
    props: {
      startups,
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
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
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
              <option value="Electric Mobility">Electric Mobility</option>
              <option value="Energy Management and Customer Empowerment">
                Energy Management and Customer Empowerment
              </option>
              <option value="Energy Marketplace">Energy Marketplace</option>
              <option value="Grid Integration of Renewables">
                Grid Integration of Renewables
              </option>
              <option value="Net Zero">Net Zero</option>
              <option value="Smart Buildings and Infrastructure">
                Smart Buildings and Infrastructure
              </option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
      </div>
      <div className="container mx-auto my-2">
        <div className="flex flex-wrap -m-2 pt-4">
          {filteredStartups.map((startup) => (
            <Startup
              key={startup.id}
              name={startup.name}
              img={startup.image}
              link={"/startup/" + startup.slug}
              city={startup.city}
              country={startup.country}
              description={startup.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
