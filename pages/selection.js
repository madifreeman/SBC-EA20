import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { q, client } from "@/utils/fauna";
import { TickIcon, CrossIcon } from "@/public/icons";
import { mean } from "mathjs";
const Column = dynamic(import("@/components/Column")); // Dynamic import required otherwise
// next.js does not allow for components
// to be dragged and dropped (get error
// "Draggable[id: 17terawatts]: Unable to find drag handle")

export async function getServerSideProps() {
  const results = await client.query({
    startupResults: q.Select(
      ["data"],
      q.Map(
        q.Paginate(q.Documents(q.Collection("Startups"))),
        q.Lambda(
          "startupRef",
          q.Let(
            { startupDoc: q.Get(q.Var("startupRef")) },
            {
              // Get info about Startup
              name: q.Select(["data", "name"], q.Var("startupDoc")),
              slug: q.Select(["data", "slug"], q.Var("startupDoc")),
              country: q.Select(["data", "country"], q.Var("startupDoc")),
              // Get matrix of all scores submitted for startup
              scores: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("feedback_scores_by_startup"),
                    q.Select(["ref"], q.Var("startupDoc"))
                  )
                )
              ),
            }
          )
        )
      )
    ),
    // Get matrix of all scores submitted for all startups
    overallResults: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_feedback_scores")))
    ),
  });

  const getAverages = (data) => {
    const questionMeans = mean(data, 0); // Find mean for each column in matrix (each column maps to a specific question on feedback form)
    return {
      Total: mean(questionMeans).toFixed(2), // Find overall mean for all questions
      // Sort questions into categories and find mean for each category
      "Team & Ability": mean(questionMeans.slice(0, 3)).toFixed(2),
      "Market & Product": mean(questionMeans.slice(3, 6)).toFixed(2),
      "Execution Power": mean(questionMeans.slice(6, 9)).toFixed(2),
    };
  };

  const startups = results.startupResults;
  const overallScores = results.overallResults;

  let startupsData = {};
  startups.forEach((startup) => {
    const categoryAverages =
      startup.scores.length < 1
        ? {
            Total: null,
            "Team & Ability": null,
            "Market & Product": null,
            "Execution Power": null,
          }
        : getAverages(startup.scores);
    startupsData[startup.slug] = {
      name: startup.name,
      id: startup.slug,
      country: startup.country,
      averages: categoryAverages,
    };
  });

  const overallAverages = getAverages(overallScores);

  return { props: { startupsData, overallAverages } };
}

export default function Selection({ startupsData, overallAverages }) {
  const [startups, setStartups] = useState(startupsData);
  const [category, setCategory] = useState("Total");
  const [columns, setColumns] = useState(
    getInitColumns(Object.keys(startupsData))
  );
  const scoreCategories = Object.keys(overallAverages);

  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  function getInitColumns(startupIds) {
    sortStartupIds(startupIds);

    return {
      accepted: {
        id: "accepted",
        title: "Accepted",
        startupIds: [],
        colour: "green",
        icon: <TickIcon />,
      },
      undecided: {
        id: "undecided",
        title: "Undecided",
        startupIds: startupIds,
        colour: "white",
      },
      rejected: {
        id: "rejected",
        title: "Rejected",
        startupIds: [],
        colour: "red",
        icon: <CrossIcon />,
      },
    };
  }

  function sortStartupIds(startupIds) {
    startupIds.sort(
      (a, b) => startups[b].averages[category] - startups[a].averages[category]
    );
    return startupIds;
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const startColumn = columns[source.droppableId];
    const finishColumn = columns[destination.droppableId];

    const startStartupIds = Array.from(startColumn.startupIds);

    const removedItem = startStartupIds.splice(source.index, 1);
    const newStartColumn = {
      ...startColumn,
      startupIds: sortStartupIds(startStartupIds),
    };

    const finishStartupIds = Array.from(finishColumn.startupIds);
    finishStartupIds.splice(destination.index, 0, draggableId);
    const newFinishColumn = {
      ...finishColumn,
      startupIds: sortStartupIds(finishStartupIds),
    };

    const newColumns = {
      ...columns,
      [newStartColumn.id]: newStartColumn,
      [newFinishColumn.id]: newFinishColumn,
    };

    setColumns(newColumns);
  };

  return (
    <div className="p-4 -mt-12">
      <div className="relative container bg-white rounded shadow-lg w-full mb-4 mx-auto">
        <div className="pl-8 pr-2 pt-4 pb-2 flex flex-wrap items-center justify-between">
          <h1 className="w-1/6 text-lg lg:text-xl font-semibold text-gray-700 self-end">
            Sort by:
          </h1>
          <ul className="flex md:px-8">
            {scoreCategories.map((category) => (
              <li className="flex items-center" key={category}>
                <input
                  type="radio"
                  id={category}
                  name="radio_group"
                  value={category}
                  defaultChecked={category === "Total"}
                  className="ml-4 lg:ml-8"
                  onChange={(e) => setCategory(e.target.value)}
                />
                <label
                  htmlFor="scoreTotal"
                  className="ml-2 text-sm lg:text-base"
                >
                  {category}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-8 pb-4 font-base text-gray-700 text-sm lg:text-base">
          <p>
            The average score for "{category}" is {overallAverages[category]}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(columns).map((key) => {
            const column = columns[key];
            const columnStartups = column.startupIds.map(
              (startupId) => startups[startupId]
            );

            return (
              <div
                className="px-4 relative container md:w-1/3 min-height-100 my-4 md:my-0"
                key={column.id}
              >
                {winReady ? (
                  <Column
                    category={category}
                    column={column}
                    startups={columnStartups}
                    key={column.id}
                  />
                ) : null}
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
