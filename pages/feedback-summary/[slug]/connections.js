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
        connections: q.Select(
          ["data"],
          q.Map(
            q.Filter(
              // Get all non-empty connections made about startup in startupDoc
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
                  connection: q.Select(
                    ["data", "connect"],
                    q.Var("feedbackDoc")
                  ),
                  anonymous: q.Select(
                    ["data", "anonymous"],
                    q.Var("feedbackDoc")
                  ),
                  mentor: q.Let(
                    // Get info regarding mentor who suggested connection
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
  const connections = results.connections.map((connection) => {
    if (connection.anonymous === "No") return connection;
    connection.mentor = null;
    return connection;
  });

  const startup = { name: results.startup, slug: params.slug };
  return {
    props: { startup, connections },
  };
}

export default function FeedbackConnections({ startup, connections }) {
  console.log(connections);
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
            <FeedbackComment comment={item.connection} mentor={item.mentor} key={Math.random()} />
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
