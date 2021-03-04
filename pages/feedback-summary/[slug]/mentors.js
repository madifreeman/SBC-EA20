import { q, client } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";
import FeedbackMentor from "@/components/FeedbackMentor";

export async function getServerSideProps({ params }) {
  const results = await client.query(
    q.Let(
      {
        startupDoc: q.Get(q.Match(q.Index("startups_by_slug"), params.slug)),
      },
      {
        startup: q.Select(["data", "name"], q.Var("startupDoc")),
        mentors: q.Select(
          ["data"],
          q.Map(
            q.Filter(
              // Get all feedback submission where mentor indicated yes to invest
              q.Paginate(
                q.Match(
                  q.Index("feedback_by_startup"),
                  q.Select(["ref"], q.Var("startupDoc")) // Get feedback by searching with the startupRef
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
            // Select the mentor reference from the feedback document and get the mentors info
            q.Lambda(
              "feedbackRef",
              q.Let(
                {
                  mentorDoc: q.Get(
                    q.Select(["data", "mentor"], q.Get(q.Var("feedbackRef")))
                  ),
                },
                {
                  firstName: q.Select(
                    ["data", "firstName"],
                    q.Var("mentorDoc")
                  ),
                  lastName: q.Select(["data", "lastName"], q.Var("mentorDoc")),
                  role: q.Select(["data", "role"], q.Var("mentorDoc")),
                  company: q.Select(["data", "company"], q.Var("mentorDoc")),
                  email: q.Select(["data", "email"], q.Var("mentorDoc")),
                  image: q.Select(["data", "image"], q.Var("mentorDoc")),
                  slug: q.Select(["data", "slug"], q.Var("mentorDoc")),
                }
              )
            )
          )
        ),
      }
    )

    
  );
  const startup = { name: results.startup, slug: params.slug };
  const mentors = results.mentors;
  
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
            <FeedbackMentor mentor={{...mentor}}/>
          ))}
        </ul>
      </FeedbackDashboardLayout>
    </div>
  );
}
