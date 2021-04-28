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
                q.Select(["data", "comments"], q.Get(q.Var("feedbackRef"))) // filter out empty comments
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
              comments: q.Select(["data", "comments"], q.Var("feedbackDoc")),
              anonymous: q.Select(["data", "anonymous"], q.Var("feedbackDoc")),
              mentorId: q.Select(["data", "mentor"], q.Var("feedbackDoc")),
            }
          )
        )
      )
    )
  );

  console.log(results)

  const mentorIds = [];
  // Deal with mentors wanting to remain anon
  const comments = results.map((comment) => {
    if (comment.anonymous === "No") {
      mentorIds.push(comment.mentorId);
      return comment;
    }
    comment.mentorId = null;
    return comment;
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
  comments.forEach((comment) => {
    comment.mentorId
      ? (comment.mentor = mentorObj[comment.mentorId])
      : null;
  });

  return {
    props: { startup, comments },
  };
}

export default function FeedbackComments({ startup, comments }) {
  console.log(comments);
  return (
    <div>
      <FeedbackDashboardLayout
        startup={startup}
        title="Mentor Comments"
        description="Below you will find feedback from mentors who attendeded Selection Days. 
        Those who wished to remain anonoymous have had their details redacted."
        selectedTab="Comments"
      >
        <ul className="pt-10">
          {comments.map((item) => (
            <FeedbackComment
              comment={item.comments}
              mentor={item.mentor}
              key={Date.now()}
            />
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
