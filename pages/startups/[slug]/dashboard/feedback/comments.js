import { q, client } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";
import FeedbackComment from "@/components/FeedbackComment";

export async function getServerSideProps({ params }) {
  const results = await client.query(
    q.Let(
      {
        startupDoc: q.Get(q.Match(q.Index("startups_by_slug"), params.slug)),
      },
      {
        startup: q.Select(["data", "name"], q.Var("startupDoc")),
        comments: q.Select(
          ["data"],
          q.Map(
            q.Filter(
              // Get all non-empty comments made about startup in startupDoc
              q.Paginate(
                q.Match(
                  q.Index("feedback_by_startup"),
                  q.Select(["ref"], q.Var("startupDoc")) // Get feedback by searching with the startupRef
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
                  comment: q.Select(["data", "comments"], q.Var("feedbackDoc")),
                  anonymous: q.Select(
                    ["data", "anonymous"],
                    q.Var("feedbackDoc")
                  ),
                  mentor: q.Let(
                    // Get info regarding mentor who made comment
                    {
                      mentorDoc: q.Get(
                        q.Select(["data", "mentor"], q.Var("feedbackDoc"))
                      ),
                    },

                    {
                      firstName: q.Select(
                        ["data", "firstName"],
                        q.Var("mentorDoc")
                      ),
                      lastName: q.Select(
                        ["data", "lastName"],
                        q.Var("mentorDoc")
                      ),
                      role: q.Select(["data", "role"], q.Var("mentorDoc")),
                      company: q.Select(
                        ["data", "company"],
                        q.Var("mentorDoc")
                      ),
                      email: q.Select(["data", "email"], q.Var("mentorDoc")),
                      image: q.Select(["data", "image"], q.Var("mentorDoc")),
                      slug: q.Select(["data", "slug"], q.Var("mentorDoc")),
                    }
                  ),
                }
              )
            )
          )
        ),
      }
    )
  );

  // Deal with mentors wanting to remain anon
  const comments = results.comments.map((comment) => {
    if (comment.anonymous === "No") return comment;
    comment.mentor = null;
    return comment;
  });

  const startup = { name: results.startup, slug: params.slug };
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
            <FeedbackComment comment={item.comment} mentor={item.mentor} key={Date.now()}/>
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
