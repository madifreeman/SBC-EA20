import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { q, client } from "@/utils/fauna";
import { TickIcon, CrossIcon } from "@/public/icons";
import { all, ctransposeDependencies, mean, to } from "mathjs";
const Column = dynamic(import("@/components/Column"));
// Dynamic import required otherwise next.js does not allow for
// components to be dragged and dropped (get error "Draggable[id: 17terawatts]: Unable to find drag handle")

export async function getServerSideProps() {
  // Get Startup, location, average score, num of forms submitted
  const startupResults = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Startups"))),
      q.Lambda(
        "startupRef",
        q.Let(
          { startupDoc: q.Get(q.Var("startupRef")) },
          {
            name: q.Select(["data", "name"], q.Var("startupDoc")),
            slug: q.Select(["data", "slug"], q.Var("startupDoc")),
            country: q.Select(["data", "country"], q.Var("startupDoc")),
            scores: {
              knowledge: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("knowledge_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              passion: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("passion_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              ability: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("ability_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              market: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("market_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              competitive: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("competitive_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              product: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("product_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              traction: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("traction_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              marketing: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("marketing_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
              presentation: q.Select(
                ["data"],
                q.Paginate(
                  q.Match(
                    q.Index("presentation_scores_by_startup"),
                    q.Var("startupRef")
                  )
                )
              ),
            },
          }
        )
      )
    )
  );

  const totalResults = await client.query({
    knowledge: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_knowledge_scores")))
    ),
    passion: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_passion_scores")))
    ),
    ability: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_ability_scores")))
    ),
    market: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_market_scores")))
    ),
    competitive: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_competitive_scores")))
    ),
    product: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_product_scores")))
    ),
    traction: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_traction_scores")))
    ),
    marketing: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_marketing_scores")))
    ),
    presentation: q.Select(
      ["data"],
      q.Paginate(q.Match(q.Index("all_presentation_scores")))
    ),
  });

  function getAverages(data) {
    let averages = {};
    const {
      knowledge,
      passion,
      ability,
      market,
      competitive,
      product,
      traction,
      marketing,
      presentation,
    } = data;
    const categories = {
      Total: knowledge.concat(
        passion,
        ability,
        market,
        competitive,
        product,
        traction,
        marketing,
        presentation
      ),
      "Team & Ability": knowledge.concat(passion, ability),
      "Market & Product": market.concat(competitive, product),
      "Execution Power": traction.concat(marketing, presentation),
    };
    Object.keys(categories).forEach((key) => {
      if (categories[key].length > 1)
        averages[key] = mean(categories[key]).toFixed(2);
      else averages[key] = 0;
    });

    return averages;
  }

  // Find averages for each startup
  const startups = startupResults.data;
  let startupsData = {};

  startups.forEach((startup) => {
    const averages = getAverages(startup.scores);
    startupsData[startup.slug] = {
      name: startup.name,
      id: startup.slug,
      country: startup.country,
      averages: averages,
    };
  });

  // Find total averages
  const totalAverages = getAverages(totalResults);

  return { props: { startupsData, totalAverages } };
}

function getInitColumns(startupsData) {
  const startupIds = Object.keys(startupsData);
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



export default function Selection({ startupsData, totalAverages }) {
  const [startups, setStartups] = useState(startupsData);
  const [category, setCategory] = useState("Total");
  const [columns, setColumns] = useState(getInitColumns(Object.keys(startupsData)));

  const scoreCategories = Object.keys(totalAverages);

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
    console.log(startupIds)
    startupIds.sort(
      (a, b) =>
        startups[b].averages[category] - startups[a].averages[category]
    );
    console.log(startupIds)
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
              <li className="flex items-center" key={category.id}>
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
            The average score for "{category}" is {totalAverages[category]}
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
