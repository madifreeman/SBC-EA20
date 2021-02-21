import Header from "../src/components/Header";
import React from "react";
import Airtable from "airtable";
import Footer from "../src/components/Footer";
import { q, client } from "../src/fauna";

// const airtable = new Airtable({
//   apiKey: process.env.AIRTABLE_API_KEY,
// });

// export async function getServerSideProps(context) {
//   const records = await airtable
//     .base(process.env.AIRTABLE_BASE_ID)("Startups")
//     .select({
//       fields: [
//         "Name",
//         "Photo",
//         "Slug",
//         "City",
//         "Country",
//         "Short Description",
//         "Themes",
//       ],
//     })
//     .all();

//   const startups = records.map((startup) => {
//     return {
//       key: startup.getId(),
//       id: startup.getId(),
//       name: startup.get("Name"),
//       slug: startup.get("Slug"),
//       image: startup.get("Photo") ? startup.get("Photo")[0].url : "",
//       city: startup.get("City"),
//       country: startup.get("Country"),
//       description: startup.get("Short Description"),
//       themes: startup.get("Themes") || [],
//     };
//   });

//   return {
//     props: {
//       startups,
//     },
//   };
// }

export async function getServerSideProps(context) {
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

class ManageStartups extends React.Component {
  constructor(props) {
    super(props);
    this.state = { startups: this.props.startups };
  }
  
  render() {
    return (
      <div>
        <Header height="36" />
        <div className="relative container bg-white rounded shadow-lg w-full p-8 mx-auto  items-center flex justify-between">
          <div className="">
            <h1 className="sm:text-3xl text-xl font-semibold text-gray-700 self-end">
              Manage Startups
            </h1>
          </div>
          <div>
            <div className="block float-right">
              <a
                href="/addStartup"
                className="btn bg-teal-600 border-teal-600 text-white inline"
              >
                + Add Startup
              </a>
            </div>
          </div>
        </div>
        <div className="container mx-auto my-2">
          <div className="flex flex-wrap -m-2 pt-4">
            {this.state.startups.map((startup) => (
              <div className="w-full lg:w-1/2 z-0 hover:z-10 p-2" key={startup.id}>
                  <div className="h-full flex flex-inline justify-between items-center px-8 py-2 md:py-12 bg-white shadow hover:shadow-lg group rounded">
                    <img
                      className="h-20 w-20 mx-auto mb-4 sm:ml-0 sm:mr-8 lg:mr-0 sm:mb-0 p-1 object-cover rounded-full border-gray-200 group-hover:border-teal-500 border-2"
                      src={startup.image}
                    ></img>
                    <h2 className="w-full sm:w-4/6 lg:pl-8 sm:text-xl sm:text-left text-lg group-hover:text-teal-500 font-semibold">
                      {startup.name}
                    </h2>
                    <div className="flex">
                      <a
                        href={`/edit/${startup.slug}`}
                        className="btn bg-teal-600 border-teal-600 text-white"
                      >
                        Edit
                      </a>
                      <input
                        className="btn bg-teal-600 border-teal-600 text-white cursor-pointer"
                        value="Delete"
                        type="button"
                        onClick={async (e) => {
                          e.target.value = "Deleting..."
                          await client.query(
                            q.Delete (
                              q.Ref(q.Collection("Startups"), startup.id)
                            )
                          )
                          const newStartups = this.state.startups.filter(item => item.id !== startup.id)
                          this.setState({startups: newStartups})
                          // airtable
                          //   .base(process.env.AIRTABLE_BASE_ID)("Startups")
                          //   .destroy([startup.id])
                          //   .then(()=>{
                          //     const newStartups = this.state.startups.filter(item => item.id !== startup.id)
                          //     this.setState({startups: newStartups})
                          //   })
                          
                        }}
                      />
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default ManageStartups;
