import { q, client as faunaClient } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";
import FeedbackComment from "@/components/FeedbackComment";
import sanityClient from "@/utils/sanity";
import groq from "groq";

export async function getServerSideProps({ params }) {
  const startupQuery = groq`*[_type == "startup" && slug.current == $slug][0]{
    name, 
    _id,
    'slug': slug.current
  }`;
  const startup = await sanityClient.fetch(startupQuery, { slug: params.slug });

  const results = await faunaClient.query(
    q.Select(
      ["data"],
      q.Map(
        q.Filter(
          // Get all non-empty connections made about startup in startupDoc
          q.Paginate(
            q.Match(
              q.Index("feedback_by_startup"),
              startup._id // Get feedback by searching with the startupRef
            )
          ),
          q.Lambda(
            "feedbackRef",
            q.Not(
              q.Equals(
                "",
                q.Select(["data", "connect"], q.Get(q.Var("feedbackRef"))) // filter out empty connections
              )
            )
          )
        ),
        q.Lambda(
          // transform into usable format
          "feedbackRef",
          q.Let(
            {
              feedbackDoc: q.Get(q.Var("feedbackRef")),
            },
            {
              connection: q.Select(["data", "connect"], q.Var("feedbackDoc")),
              anonymous: q.Select(["data", "anonymous"], q.Var("feedbackDoc")),
              mentorId: q.Select(["data", "mentor"], q.Var("feedbackDoc")),
            }
          )
        )
      )
    )
  );

  const mentorIds = [];
  // Deal with mentors wanting to remain anon
  const connections = results.map((connection) => {
    if (connection.anonymous === "No") {
      mentorIds.push(connection.mentorId);
      return connection;
    }
    connection.mentorId = null;
    return connection;
  });

  // Get mentor information from Sanity
  const mentorsQuery = groq`*[_type == "mentor" && _id in $mentorIds]{
    firstName, 
    lastName,
    role,
    company,
    email, 
    image,
    _id,
    'slug': slug.current
  }`;
  const mentorArr = await sanityClient.fetch(mentorsQuery, { mentorIds });
  
  // Map mentor info to each connection 
  const mentorObj = {};
  mentorArr.forEach((mentor) => (mentorObj[mentor._id] = mentor));
  connections.forEach((connection) => {
    connection.mentorId
      ? (connection.mentor = mentorObj[connection.mentorId])
      : null;
  });

  return {
    props: { startup, connections },
  };
}

export default function FeedbackConnections({ startup, connections }) {
  return (
    <div>
      <FeedbackDashboardLayout
        startup={startup}
        title="Potential Connections"
        description={`This is a list of mentors from Selection Days who indicated that they have some potential connections within the industry that could help ${startup}. Some of the comments are extremely vague so we would suggest reaching out to each of them.`}
        selectedTab="Connections"
      >
        <ul className="pt-10">
          {connections.map((item) => (
            <FeedbackComment
              comment={item.connection}
              mentor={item.mentor}
              key={Math.random()}
            />
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
