import {
  ChartBarIcon,
  CommentIcon,
  HandshakeIcon,
  InvestIcon,
  UsersIcon,
} from "@/public/icons";
import Link from "next/link";

const FeedbackMenu = ({ selectedTab, slug }) => {
  const iconWidth = 5;
  const tabs = [
    {
      name: "Scores",
      icon: <ChartBarIcon width={iconWidth} />,
      link: "/startups/" + slug + "/dashboard/feedback/scores",
    },
    {
      name: "Comments",
      icon: <CommentIcon width={iconWidth} />,
      link: "/startups/" + slug + "/dashboard/feedback/comments",
    },
    {
      name: "Connections",
      icon: <InvestIcon width={iconWidth} />,
      link: "/startups/" + slug + "/dashboard/feedback/connections",
    },
    {
      name: "Investors",
      icon: <HandshakeIcon width={iconWidth} />,
      link: "/startups/" + slug + "/dashboard/feedback/investors",
    },
    {
      name: "Mentors",
      icon: <UsersIcon width={iconWidth} />,
      link: "/startups/" + slug + "/dashboard/feedback/mentors",
    },
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
                <Link href={tab.link}>
                  <a className="group-hover:text-teal-500 text-black">
                    {tab.name}
                  </a>
                </Link>
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
                <Link href={tab.link}>
                  <a className="group-hover:text-teal-500 ">{tab.name}</a>
                </Link>
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
};

const FeedbackDashboardPageTitle = ({ startup, title, description }) => (
  <div className="pb-10">
    <h2 className="pb-2 text-xl font-semibold text-teal-500 leading-none">
      {startup}
    </h2>
    <h3 className="pb-6 text-3xl font-semibold text-gray-900 leading-none">
      {title}
    </h3>
    <p className="text-base text-gray-700 max-w-2xl">{description}</p>
  </div>
);

const FeedbackDashoardLayout = ({
  children,
  startup,
  title,
  description,
  selectedTab,
}) => {
  console.log(startup)
  return (
  <div className="relative px-4 xs:px-8 mt-12">
    <div className="container mx-auto -mt-16">
      <div className="flex flex-wrap -mx-4">
        <div className="z-10 w-full px-4 pb-8 md:w-full lg:w-1/3 xl:w-1/4">
          <FeedbackMenu selectedTab={selectedTab} slug={startup.slug} />
        </div>

        <div className="z-10 w-full px-4 md:w-full lg:w-2/3 xl:w-3/4">
          <div className="p-8 sm:p-12 bg-white rounded-lg shadow">
            <FeedbackDashboardPageTitle
              startup={startup.name}
              title={title}
              description={description}
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
)};

export default FeedbackDashoardLayout;
