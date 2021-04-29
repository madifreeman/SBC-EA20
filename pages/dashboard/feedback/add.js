import sanityClient from "@/utils/sanity";
import { q, client as faunaClient } from "@/utils/fauna";
import { useState } from "react";
import groq from "groq";
import FeedbackForm from "@/components/FeedbackForm";

export async function getServerSideProps() {
  const mentorQuery = groq`*[_type == "mentor" && slug.current == $slug][0]{_id}`;
  const mentor = await sanityClient.fetch(mentorQuery, {
    slug: "caitlin-o-farrell", //TODO: make dynamic with auth system
  });

  const startupsArr = await sanityClient.fetch(groq`
      *[_type == "startup"]{name, _id, 'cohortId': cohort->_id}
    `);

  const feedbackSubmittedFor = await faunaClient.query(
    q.Select(
      ["data"],
      q.Paginate(
        q.Match(
          q.Index("submitted_feedback_by_mentor"),
          // mentor ref
          mentor._id
        )
      )
    )
  );

  const startups = {};
  startupsArr.forEach(startup => {
    startup.feedbackSubmitted = feedbackSubmittedFor.includes(startup._id)
    startups[startup._id] = startup
  })

  return {
    props: { mentor, startups },
  };
}

export default function LeaveFeedback({ mentor, startups }) {
  const [selectedStartupId, setSelectedStartupId] = useState();
  console.log(startups)
  return (
    <div className="-mt-8">
      <div className="relative px-4 pb-2 xs:px-8">
        <div className="container mx-auto ">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full lg:w-4/5 xl:w-2/3 mx-auto">
              <div className="px-3 pt-8 lg:pt-0">
                <div className="px-8 py-10 bg-white rounded-lg shadow sm:px-12 sm:py-12">
                  <div className="flex items-center">
                    <h1 className="w-full text-3xl font-semibold text-gray-700 self-end">
                      Leave feedback
                    </h1>
                  </div>
                  <p className="pt-4">
                    The information you enter below will be shared with the
                    startup. If you like, you will have the option to anonymise
                    your feedback at the end of the form.
                  </p>
                  <FeedbackForm
                    defaultValues={{}}
                    mentorId={mentor._id}
                    startups={startups}
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
