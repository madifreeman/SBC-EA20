import { useState } from "react";
import { q, client } from "@/utils/fauna";
import { jsonFetcher } from "@/utils/jsonFetcher";
import Link from "next/link";

export async function getServerSideProps(context) {
  const results = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Startups"))),
      q.Lambda(
        "startupRef",
        q.Let(
          {
            startupDoc: q.Get(q.Var("startupRef")),
          },
          {
            id: q.Select(["ref", "id"], q.Var("startupDoc")),
            name: q.Select(["data", "name"], q.Var("startupDoc")),
            image: q.Select(["data", "image"], q.Var("startupDoc")),
            slug: q.Select(["data", "slug"], q.Var("startupDoc")),
          }
        )
      )
    )
  );

  const startups = results.data;

  return {
    props: {
      startups,
    },
  };
}

export default function ManageStartups({ startups }) {
  const [currentStartups, setStartups] = useState(startups);

  async function handleDelete(e, startup) {
    e.target.value = "Deleting...";
    await jsonFetcher(`/api/startups/${startup.id}`, {
      method: "DELETE",
    });

    const newStartups = currentStartups.filter(
      (item) => item.id !== startup.id
    );
    setStartups(newStartups);
  }
  return (
    <div>
      <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto  items-center flex justify-between">
        <div className="">
          <h1 className="sm:text-3xl text-xl font-semibold text-gray-700 self-end">
            Manage Startups
          </h1>
        </div>
        <div>
          <div className="block float-right">
            <Link href="/startups/add">
              <a className="btn bg-teal-600 border-teal-600 text-white inline">
                + Add Startup
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto my-2">
        <div className="flex flex-wrap -m-2 pt-4">
          {currentStartups.map((startup) => (
            <div
              className="w-full lg:w-1/2 z-0 hover:z-10 p-2"
              key={startup.id}
            >
              <div className="h-full flex flex-inline justify-between items-center px-8 py-2 md:py-12 bg-white shadow hover:shadow-lg group rounded">
                <img
                  className="h-20 w-20 mx-auto mb-4 sm:ml-0 sm:mr-8 lg:mr-0 sm:mb-0 p-1 object-cover rounded-full border-gray-200 group-hover:border-teal-500 border-2"
                  src={startup.image}
                ></img>
                <h2 className="w-full sm:w-4/6 lg:pl-8 sm:text-xl sm:text-left text-lg group-hover:text-teal-500 font-semibold">
                  {startup.name}
                </h2>
                <div className="flex">
                  <Link href={`/startups/edit/${startup.slug}`}>
                    <a className="btn bg-teal-600 border-teal-600 text-white">
                      Edit
                    </a>
                  </Link>
                  <input
                    className="btn bg-teal-600 border-teal-600 text-white cursor-pointer"
                    value="Delete"
                    type="button"
                    onClick={async (e) => handleDelete(e, startup)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
