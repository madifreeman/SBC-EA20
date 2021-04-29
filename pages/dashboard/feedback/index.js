import FeedbackForm from "@/components/FeedbackForm";
import { q, client as faunaClient } from "@/utils/fauna";
import sanityClient from "@/utils/sanity";
import groq from "groq";
import urlFor from "@/utils/imageUrlBuilder";

export async function getServerSideProps({ query }) {
  const startupQuery = groq`*[_type == "startup" && slug.current == $slug][0]{
      name, 
      city, 
      country, 
      description, 
      image,
      _id,
      'cohortId': cohort->_id
  }`;
  const mentorQuery = groq`*[_type == "mentor" && slug.current == $slug][0]{_id}`;

  const startup = await sanityClient.fetch(startupQuery, {
    slug: query.startup,
  });
  const mentor = await sanityClient.fetch(mentorQuery, {
    slug: "caitlin-o-farrell",
  });

  const scoreResults = await faunaClient.query(
    q.Select(
      ["data"],
      q.Map(
        q.Paginate(
          q.Match(
            q.Index("feedback_by_mentor_and_startup"),
            // mentor ref
            mentor._id,
            // startup ref
            startup._id
          )
        ),
        q.Lambda("feedbackRef", q.Get(q.Var("feedbackRef")))
      )
    )
  );

  const scores = scoreResults[0] ? scoreResults[0].data : {};

  if (Object.keys(scores).length > 0) {
    scores.id = scoreResults[0].ref.id;
  }

  return {
    props: { startup, scores, mentor },
  };
}

export default function LeaveFeedback({ startup, mentor, scores }) {
  console.log(mentor);

  return (
    <div className="-mt-8">
      <div className="relative px-4 pb-2 xs:px-8">
        <div className="container mx-auto ">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4 md:w-full lg:w-2/5 xl:w-1/3">
              <div className="px-8 py-12 bg-white rounded-lg shadow">
                <div className="flex flex-wrap justify-start text-center md:flex-nowrap lg:flex-wrap md:text-left lg:text-center">
                  <img
                    className="object-cover w-48 h-48 mx-auto border-2 border-gray-200 rounded-full md:mx-0 lg:mx-auto"
                    src={urlFor(startup.image)}
                  />

                  <div className="w-full pt-4 pl-0 mx-auto md:w-auto lg:w-full md:mx-0 lg:mx-auto md:pl-8 lg:pl-0 md:pt-0 lg:pt-4">
                    <h1 className="text-2xl font-semibold">{startup.name}</h1>
                    <p className="text-gray-500 text-xl">
                      {startup.city + ", " + startup.country}
                    </p>
                    <p className="pt-4">{startup.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-3/5 xl:w-2/3">
              <div className="px-3 pt-8 lg:pt-0">
                <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                  <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
                    Leave feedback for {startup.name}
                  </h1>
                  <p className="pt-4">
                    The information you enter below will be shared with the
                    startup. If you like, you will have the option to anonymise
                    your feedback at the end of the form.
                  </p>
                  <FeedbackForm
                    defaultValues={scores}
                    mentorId={mentor._id}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
