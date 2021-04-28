import { q, client as faunaClient } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";
import FeedbackMentor from "@/components/FeedbackMentor";
import sanityClient from "@/utils/sanity";
import groq from "groq";

export async function getServerSideProps({ params }) {
  const startupQuery = groq`*[_type == "startup" && slug.current == $slug][0]{
    name, 
    _id,
    'slug': slug.current
  }`;
  const startup = await sanityClient.fetch(startupQuery, { slug: params.slug });

  const investorIds = await faunaClient.query(
    q.Select(
      ["data"],
      q.Map(
        // Get all feedback submission where mentor indicated yes to investor
        q.Filter(
          q.Paginate(
            q.Match(
              q.Index("feedback_by_startup"),
              startup._id // Get feedback by searching with the startupRef
            )
          ),
          q.Lambda(
            "feedbackRef",
            q.Equals(
              "Yes",
              q.Select(["data", "invest"], q.Get(q.Var("feedbackRef"))) // filter out those who didn't say yes
            )
          )
        ),
        // Get the investors id 
        q.Lambda(
          "feedbackRef",
          q.Let(
            { feedbackDoc: q.Get(q.Var("feedbackRef")) },
            q.Select(["data", "mentor"], q.Var("feedbackDoc"))
          )
        )
      )
    )
  );

  const mentorsQuery = groq`*[_type == "mentor" && _id in $investorIds]{
      firstName, 
      lastName,
      role,
      company,
      email, 
      image,
      'slug': slug.current
    }`;

  const investors = await sanityClient.fetch(mentorsQuery, { investorIds });
  
  return {
    props: { startup, investors },
  };
  }

export default function FeedbackComments({ startup, investors }) {
  return (
    <div>
      <FeedbackDashboardLayout
        startup={startup}
        title="Investment Interest"
        description="This is a list of mentors from Selection Days who indicated that they would be interested in discussing potential investment in 17TeraWatts."
        selectedTab="Investors"
      >
        <ul className="pt-10">
          {investors.map((investor) => (
            <FeedbackMentor mentor={{...investor}}/>
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
