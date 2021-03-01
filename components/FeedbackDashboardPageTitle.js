
const FeedbackDashboardPageTitle = ({ startup, title, description }) => (
  <div className="pb-10">
    <h2 className="pb-2 text-xl font-semibold text-teal-500 leading-none">
      {startup}
    </h2>
    <h3 className="pb-6 text-3xl font-semibold text-gray-900 leading-none">
      {title}
    </h3>
    <p className="text-base text-gray-700 max-w-2xl">
      {description}
    </p>
  </div>
);

export default FeedbackDashboardPageTitle;
