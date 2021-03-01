import FeedbackMenu from "@/components/FeedbackMenu";
import FeedbackDashboardPageTitle from "@/components/FeedbackDashboardPageTitle";
import { q, client } from "@/utils/fauna";

export async function getServerSideProps({ params }) {
  // Get Startup name and ref ID
  const results = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("startups_by_slug"), params.slug)),
      q.Lambda(
        "startupRef",
        q.Let(
          {
            startupDoc: q.Get(q.Var("startupRef")),
          },
          {
            id: q.Select(["ref", "id"], q.Var("startupDoc")),
            name: q.Select(["data", "name"], q.Var("startupDoc")),
          }
        )
      )
    )
  );

  
  const startup = results.data[0];
  return {
    props: { startup },
  };


}

export default function FeedbackComments({ startup }) {
  return (
    <div>
      <div className="relative px-4 xs:px-8 mt-14">
        <div className="container mx-auto -mt-16">
          <div className="flex flex-wrap -mx-4">
            <div className="z-10 w-full px-4 pb-8 md:w-full lg:w-1/3 xl:w-1/4">
              <FeedbackMenu selectedTab="Comments" />
            </div>
            <div className="z-10 w-full px-4 md:w-full lg:w-2/3 xl:w-3/4">
              <div className="p-8 sm:p-12 bg-white rounded-lg shadow">
                <FeedbackDashboardPageTitle
                  startup={startup.name}
                  title="Mentor Comments"
                  description="Below you will find feedback from mentors who attendeded Selection Days. 
                  Those who wished to remain anonoymous have had their details redacted."
                />
                <ul className="pt-10">
                  <li className="flex items-center justify-between py-8 border-t border-gray-200">
                    <div className="flex flex-wrap w-full sm:flex-no-wrap">
                      <a
                        className="flex-shrink-0 block w-32 h-32 mx-auto sm:w-24 sm:h-24 sm:mx-0"
                        href="/mentor/grant-hatamosa"
                      >
                        <img
                          className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full sm:w-24 sm:h-24 hover:border-teal-600"
                          src="https://dl.airtable.com/.attachmentThumbnails/d95e6e858d48a2e61acc0aca5177f557/832e2997"
                        />
                      </a>
                      <div className="flex-shrink w-full pt-2 text-center sm:pl-3 sm:w-auto sm:text-left">
                        <h4 className="text-xl font-semibold">
                          <a
                            className="hover:text-teal-600"
                            href="/mentor/grant-hatamosa"
                          >
                            Grant Hatamosa
                          </a>
                        </h4>
                        <p className="hidden text-base leading-snug text-gray-500 sm:block">
                          General Manager at Zen Ecosystems
                        </p>
                        <p className="block text-base text-gray-500 sm:hidden">
                          Zen Ecosystems
                        </p>
                        <p className="block text-sm text-gray-500 sm:hidden">
                          General Manager
                        </p>
                        <a
                          className="block pt-2 text-sm text-gray-700 hover:text-teal-600 sm:pt-1"
                          href="mailto:grant.hatamosa@zenecosystems.com"
                        >
                          grant.hatamosa@zenecosystems.com
                        </a>

                        <div className="inline-block w-auto px-3 py-2 mt-3 text-base italic bg-gray-100 border border-gray-200 rounded">
                          "they need to understand the market more."
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
