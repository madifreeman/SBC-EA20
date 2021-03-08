import { Droppable, Draggable } from "react-beautiful-dnd";

const Startup = ({ startup, index, category }) => {
  return (
    <Draggable draggableId={startup.id} index={index}>
      {(provided) => (
        <div
          className="p-2 cursor-pointer w-full"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="flex overflow-hidden bg-gray-100 rounded-lg shadow-md items-center font-semibold">
            <div className="py-5 bg-teal-500 text-white text-center w-1/4">
              {startup.averages[category] ? startup.averages[category] : "N/A"}
            </div>
            <div className="p-2 text-base md:text-sm lg:text-base">
              <p>{startup.name}</p>{" "}
              <p className="text-sm text-gray-600 font-normal">
                {startup.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default function Column({ column, startups, category }) {
  startups.sort((a, b) => b.averages[category] - a.averages[category])
  return (
    <div
      className={`bg-${column.colour}-100 bg-opacity-70 rounded-lg shadow-lg py-8 px-5 h-full`}
    >
      <h2 className="font-semibold text-lg text-gray-700 flex items-center">
        <span className={`px-2 text-${column.colour}-600`}>{column.icon ? column.icon : null}</span> {column.title}
      </h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="h-full"
          >
            {startups.map((startup, index) => {
              return (
                <Startup
                  startup={startup}
                  index={index}
                  key={startup.id}
                  category={category}
                />
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </div>
  );
}
