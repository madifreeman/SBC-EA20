import { q, client } from "@/utils/fauna";
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

  const mentorIds = await client.query(
    q.Select(
      ["data"],
      q.Map(
        // Get all feedback submission where mentor indicated yes to mentor
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
              q.Select(["data", "mentoring"], q.Get(q.Var("feedbackRef"))) // filter out those who didn't say yes
            )
          )
        ),
        // Get the mentors id 
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

  const mentorsQuery = groq`*[_type == "mentor" && _id in $mentorIds]{
      firstName, 
      lastName,
      role,
      company,
      email, 
      image,
      'slug': slug.current
    }`;
  const mentors = await sanityClient.fetch(mentorsQuery, { mentorIds });
  
  return {
    props: { startup, mentors },
  };
}

export default function FeedbackComments({ startup, mentors }) {
  return (
    <div>
      <FeedbackDashboardLayout
        startup={startup}
        title="Mentor Interest"
        description="This is a list of mentors from Selection Days who indicated that they would be interested mentoring 17TeraWatts. Even if you didn't make it onto the program, we definitely recomend reaching out to these mentors."
        selectedTab="Mentors"
      >
        <ul className="pt-10">
          {mentors.map((mentor) => (
            <FeedbackMentor mentor={{ ...mentor }} />
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
