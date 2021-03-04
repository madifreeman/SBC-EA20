import Link from "next/link";
import {
  RightArrow,
  UserEditIcon,
  LightbulbIcon,
  GraduationCapIcon,
} from "@/public/icons";

export default function Home() {
  return (
    <div className="relative px-4 xs:px-8">
      <div className="container mx-auto -mt-16">
        <div className="relative flex flex-wrap -mt-24 -m-2">
          <div className="w-full lg:w-1/3 p-2">
            <Content
              icon={<UserEditIcon />}
              heading="Want to attend?"
              subheading="Sign up today and be part of this unique experience."
              buttonText="Register Now"
            />
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-2">
            <Content
              icon={<LightbulbIcon />}
              heading="Our Startups"
              subheading="After receiving 1000+ applications worldwide, these are the 20 finalists."
              buttonText="View Startups"
            />
          </div>

          <div className="w-full md:w-1/2 lg:w-1/3 p-2">
            <Content
              icon={<GraduationCapIcon />}
              heading="Our Mentors"
              subheading="Meet the most experienced leaders in the smart energy industry."
              buttonText="View Mentors"
            />
          </div>
        </div>

        <div className="relative flex flex-wrap my-16 lg:my-24">
          <div className="w-full lg:w-1/2 lg:pr-8 pt-12 lg:py-8">
            <h3 className="inline-block text-teal-500 font-semibold">
              About Selection Days
            </h3>
            <div className="w-20 h-1 mt-2 bg-teal-500"></div>
            <p className="pt-4 font-light text-3xl md:text-4xl">
              We’ve scoured the globe, met and mentored the top energy startups
              across 26 cities in 5 continents.
            </p>
            <p className="pt-6">
              The top 20 most disruptive energy teams from around the world are
              coming to Melbourne for Startupbootcamp’s Selection Days.
            </p>
            <p className="pt-4">
              During this incredible 2-day event, we will be calling upon 100+
              industry experts, mentors and partners to help select the final
              teams. They will listen, give feedback and mentor all of the
              teams. They will also help us choose which of the teams will be
              selected to join our program in January 2020.
            </p>
            <p className="pt-4">
              We will announce the final top 10 teams on the afternoon of 5th
              December, followed by drinks and networking. We look forward to
              seeing you there!
            </p>
            <p className="pt-6">
              <Link href="/startups" >
              <a className="text-teal-500 font-semibold flex items-center">
                <p className="pr-2">View Startups{" "}</p>
                <RightArrow width="4"/>
              </a>
              </Link>
            </p>
          </div>
          <div className="w-full lg:w-1/2 lg:pl-8 order-first lg:order-last">
            <img
              className="w-full h-full object-cover rounded-lg"
              src="./images/home.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Content = ({ icon, heading, subheading, buttonText }) => (
  <div className="h-full p-12 bg-white rounded-lg shadow text-center">
    <div className="text-teal-500 flex justify-around" aria-hidden="true">
      {icon}
    </div>
    <h3 className="pt-4 text-2xl font-semibold">{heading}</h3>
    <p className="pt-4">{subheading}</p>
    <div className="py-2 text-teal-500 font-semibold flex items-center justify-center">
      <Link href="/mentors">
        <a className="pr-1 flex">
          <p className="mx-2">{buttonText}</p> <RightArrow width="4" />{" "}
        </a>
      </Link>
    </div>
  </div>
);
