import {
  ChartBarIcon,
  CommentIcon,
  HandshakeIcon,
  InvestIcon,
  UsersIcon,
} from "@/public/icons";

const FeedbackMenu = ({ selectedTab }) => {
  const iconWidth = 5;
  const tabs = [
    { name: "Scores", icon: <ChartBarIcon width={iconWidth} /> },
    { name: "Comments", icon: <CommentIcon width={iconWidth} /> },
    { name: "Connections", icon: <InvestIcon width={iconWidth} /> },
    { name: "Investors", icon: <HandshakeIcon width={iconWidth} /> },
    { name: "Mentors", icon: <UsersIcon width={iconWidth} /> },
  ];
  return (
    <div className="p-8 sm:p-12 bg-white rounded-lg shadow">
      <h3 className="pb-3 font-semibold text-gray-500 uppercase text-base tracking-widest">
        Feedback
      </h3>
      <ul className="text-base font-medium text-gray-500 tracking-wide">
        {tabs.map((tab) => {
          if (selectedTab === tab.name) {
            return (
              <li className="py-2 group flex items-center" key={tab.name}>
                <i
                  className="text-teal-500 group-hover:text-teal-400 pr-2 text-xl w-10 text-center"
                  aria-hidden="true"
                >
                  {tab.icon}
                </i>
                <a
                  className="group-hover:text-teal-500 text-black"
                  href="/startup/recNUiPH6HXGxU76O/comments"
                >
                  {tab.name}
                </a>
              </li>
            );
          } else {
            return (
              <li className="py-2 group flex items-center" key={tab.name}>
                <i
                  className=" text-gray-500 group-hover:text-teal-400 pr-2 text-xl w-10 text-center"
                  aria-hidden="true"
                >
                  {tab.icon}
                </i>
                <a
                  className="group-hover:text-teal-500 "
                  href="/startup/recNUiPH6HXGxU76O/comments"
                >
                  {tab.name}
                </a>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

export default FeedbackMenu;
