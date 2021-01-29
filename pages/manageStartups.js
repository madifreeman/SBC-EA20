import Header from "../src/components/Header";
import React, { useState } from "react";
import Airtable from "airtable";
import Footer from "../src/components/Footer";

export async function getServerSideProps(context) {
  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  const records = await airtable
    .base(process.env.AIRTABLE_BASE_ID)("Startups")
    .select({
      fields: [
        "Name",
        "Photo",
        "Slug",
        "City",
        "Country",
        "Short Description",
        "Themes",
      ],
    })
    .all();
    
  const startups = records.map((startup) => {
    return {
      name: startup.get("Name"),
      slug: startup.get("Slug"),
      image: startup.get("Photo") ? startup.get("Photo")[0].url : "",
      city: startup.get("City"),
      country: startup.get("Country"),
      description: startup.get("Short Description"),
      themes: startup.get("Themes") || [],
    };
  });

  return {
    props: {
      startups,
    },
  };
}

export default function ManageStartups({ startups }) {
  return (
    <div>
      <Header height="36" />
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto md:flex items-center justify-between">
        
        <div className="flex w-full items-center justify-between">
            <div>
          <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
            Manage Startups
          </h1>
          </div>
          <div>
          <a href="#" className="btn bg-teal-600 border-teal-600 text-white">+ Add Startup</a>
          </div>
        </div>
        <div>
          <label className="block w-64"></label>
        </div>
      </div>
      <div className="container mx-auto my-2">
        <div className="flex flex-wrap -m-2 pt-4">
          {startups.map((startup) => (
            <div className="w-full lg:w-1/2 z-0 hover:z-10 p-2">
              <a className="block h-full" href={`/startup/${startup.slug}`}>
                <div className="h-full flex flex-inline justify-between items-center px-8 py-2 md:py-12 bg-white shadow hover:shadow-lg group rounded cursor-pointer">
                  <img
                    className="h-20 w-20 mx-auto mb-4 sm:ml-0 sm:mr-8 lg:mr-0 sm:mb-0 p-1 object-cover rounded-full border-gray-200 group-hover:border-teal-500 border-2"
                    src={startup.image}
                  ></img>
                  <h2 className="w-full sm:w-4/6 lg:pl-8 sm:text-xl sm:text-left text-lg group-hover:text-teal-500 font-semibold">
                        {startup.name}
                      </h2>
                    <div>
                      <a href={`/edit/${startup.slug}`} className="btn bg-teal-600 border-teal-600 text-white">
                        Edit
                      </a>
                      <a href="#" className="btn bg-teal-600 border-teal-600 text-white">
                        Delete
                      </a>   
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
