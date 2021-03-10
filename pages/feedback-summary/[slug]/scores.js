import { q, client } from "@/utils/fauna";
import FeedbackDashboardLayout from "@/components/FeedbackDashboardLayout";
import { mean } from "mathjs";

export async function getServerSideProps({ params }) {
  
  const feedbackResults = await client.query(
    q.Let(
      {
        startupDoc: q.Get(q.Match(q.Index("startups_by_slug"), params.slug)),
      },
      {
        // Get name of startup
        startup: q.Select(["data", "name"], q.Var("startupDoc")),
        // Get matrix of all scores submitted for startup
        startupScores: q.Select(
          ["data"],
          q.Paginate(
            q.Match(
              q.Index("feedback_scores_by_startup"),
              q.Ref(q.Collection("Startups"), "290750500378247693")
            )
          )
        ),
        // Get matrix of all scores submitted for all startups
        allScores: q.Select(
          ["data"],
          q.Paginate(q.Match(q.Index("all_feedback_scores")))
        ),
      }
    )
  );

  const categories = [
    "knowledge",
    "passion",
    "ability",
    "market",
    "competitive",
    "product",
    "traction",
    "marketing",
    "presentation",
  ];

  // Find mean for each column in matrix (each columns maps to a category)
  const startupAveragesArray = mean(feedbackResults.startupScores, 0);
  const allAveragesArray = mean(feedbackResults.allScores, 0);

  // Create objects mapping each mean score to the corresponding category
  const scores = {};
  const averages = {};
  categories.forEach((category, i) => {
    scores[category] = startupAveragesArray[i].toFixed(1);
    averages[category] = allAveragesArray[i].toFixed(1);
  });

  // Find overall averages
  scores["overall"] = mean(feedbackResults.startupScores).toFixed(1);
  averages["overall"] = mean(feedbackResults.allScores).toFixed(1);

  const startup = feedbackResults.startup;

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
          You scored: <span className="font-semibold">{score}</span>
        </p>
        <p className="text-base text-gray-700">
          Average: <span className="font-semibold">{average}</span>
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
        startup={startup}
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
