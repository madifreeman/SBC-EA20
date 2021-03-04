import { q, client } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";

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

  // Get mean score for startup on each category + overall average score on each category
  const feedbackResults = await client.query(
    q.Map(
      q.Paginate(q.Match(q.Index("feedback_by_startup"), q.Ref(q.Collection("Startups"), startup.id))),
      q.Lambda(
        "feedbackRef",
        q.Let(
          {
            feedbackDoc: q.Get(q.Var("feedbackRef")),
          },
          {
            scores: {
              knowledge: q.Mean(
                q.Paginate(
                  q.Match(q.Index("knowledge_scores_by_startup"), startup.id)
                )
              ),
              passion: q.Mean(
                q.Paginate(
                  q.Match(q.Index("passion_scores_by_startup"), startup.id)
                )
              ),
              ability: q.Mean(
                q.Paginate(
                  q.Match(q.Index("ability_scores_by_startup"), startup.id)
                )
              ),
              market: q.Mean(
                q.Paginate(
                  q.Match(q.Index("market_scores_by_startup"), startup.id)
                )
              ),
              competitive: q.Mean(
                q.Paginate(
                  q.Match(q.Index("competitive_scores_by_startup"), startup.id)
                )
              ),
              product: q.Mean(
                q.Paginate(
                  q.Match(q.Index("product_scores_by_startup"), startup.id)
                )
              ),
              traction: q.Mean(
                q.Paginate(
                  q.Match(q.Index("traction_scores_by_startup"), startup.id)
                )
              ),
              marketing: q.Mean(
                q.Paginate(
                  q.Match(q.Index("marketing_scores_by_startup"), startup.id)
                )
              ),
              presentation: q.Mean(
                q.Paginate(
                  q.Match(q.Index("presentation_scores_by_startup"), startup.id)
                )
              ),
            },
            averages: {
              knowledge: q.Mean(
                q.Paginate(q.Match(q.Index("all_knowledge_scores")))
              ),
              passion: q.Mean(
                q.Paginate(q.Match(q.Index("all_passion_scores")))
              ),
              ability: q.Mean(
                q.Paginate(q.Match(q.Index("all_ability_scores")))
              ),
              market: q.Mean(q.Paginate(q.Match(q.Index("all_market_scores")))),
              competitive: q.Mean(
                q.Paginate(q.Match(q.Index("all_competitive_scores")))
              ),
              product: q.Mean(
                q.Paginate(q.Match(q.Index("all_product_scores")))
              ),
              traction: q.Mean(
                q.Paginate(q.Match(q.Index("all_traction_scores")))
              ),
              marketing: q.Mean(
                q.Paginate(q.Match(q.Index("all_marketing_scores")))
              ),
              presentation: q.Mean(
                q.Paginate(q.Match(q.Index("all_presentation_scores")))
              ),
            },
          }
        )
      )
    )
  );

  // Turn raw results into more usable objects
  console.log(feedbackResults)
  const rawScores = feedbackResults.data[0].scores;
  const rawAverages = feedbackResults.data[0].averages;

  const scores = {};
  Object.keys(rawScores).map((key) => {
    scores[key] = rawScores[key].data[0];
  });
  const averages = {};
  Object.keys(rawAverages).map((key) => {
    averages[key] = rawAverages[key].data[0];
  });

  // Calculate overall score for startup and overall average
  scores["overall"] = await client.query(q.Mean(Object.values(scores)));
  averages["overall"] = await client.query(q.Mean(Object.values(averages)));

  return {
    props: { startup, scores, averages },
  };
}

const ScoreCard = ({ question, score, average }) => (
  <div className="flex flex-wrap mt-2 mb-8 -m-2 w-full">
    <div className="w-full text-left p-2">
      <div className="h-full border border-gray-200 rounded px-8 py-6 items-center">
        <h3 className="text-base font-semibold pb-1">{question}</h3>
        <p className="text-base text-gray-700">
          You scored: <span className="font-semibold">{score.toFixed(1)}</span>
        </p>
        <p className="text-base text-gray-700">
          Average: <span className="font-semibold">{average.toFixed(1)}</span>
        </p>
      </div>
    </div>
  </div>
);

const SectionHeading = ({ title }) => (
  <h4 className="font-semibold text-gray-500 uppercase text-base tracking-widest">
    {title}
  </h4>
);

export default function FeedbackScores({ startup, scores, averages }) {
  return (
    <div>
      <FeedbackDashboardLayout
        startup={startup.name}
        title="Score Averages"
        description="Below you will find your averaged scores from each of the mentor feedback questions. The average for each question across all the teams is also displayed so that you can see how Bia compared to the other teams at Selection Days."
        selectedTab="Scores"
      >
        <div>
          <SectionHeading title="Overall" />
          <ScoreCard
            question="Your overall score for Selection Days"
            score={scores.overall}
            average={averages.overall}
          />
        </div>
        <SectionHeading title="Team & Ability" />
        <div className="flex flex-wrap mt-2 mb-8 -m-2">
          <ScoreCard
            question="Does the team have in-depth industry knowledge?"
            score={scores.knowledge}
            average={averages.knowledge}
          />
          <ScoreCard
            question="Does the team have the passion and vision to make their
                    idea successful?"
            score={scores.passion}
            average={averages.passion}
          />
          <ScoreCard
            question="Does this team have the ability to deliver their idea?"
            score={scores.ability}
            average={averages.ability}
          />
        </div>
        <SectionHeading title="Market & Product" />
        <div className="flex flex-wrap mt-2 mb-8 -m-2">
          <ScoreCard
            question="How big is the team's potential market?"
            score={scores.market}
            average={averages.market}
          />
          <ScoreCard
            question="Is the market competitive? 10 = No Competitors"
            score={scores.competitive}
            average={averages.competitive}
          />
          <ScoreCard
            question="What do you think of this team's product or service?"
            score={scores.product}
            average={averages.product}
          />
        </div>
        <SectionHeading title="Execution Power" />
        <div className="flex flex-wrap mt-2 mb-8 -m-2">
          <ScoreCard
            question="How much market traction does the team have?"
            score={scores.traction}
            average={averages.traction}
          />
          <ScoreCard
            question="How strong is the team's branding and story?"
            score={scores.marketing}
            average={averages.marketing}
          />
          <ScoreCard
            question="How strong is the team's presentation skills?"
            score={scores.presentation}
            average={averages.presentation}
          />
        </div>
      </FeedbackDashboardLayout>
    </div>
  );
}
