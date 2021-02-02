import React from "react";
import { LinkedInIcon, TwitterIcon } from "../../public/icons";

class TeamMember extends React.Component {
  render() {
    return (
      <div className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2">
        <div className="flex items-center  text-lg px-5 py-3 mb-4 mr-0 border border-gray-200 rounded-lg md:mr-4 lg:mr-0 xl:mr-4">
          <img
            className="object-cover w-24 h-24 mr-4 border-2 border-gray-200 rounded-full"
            src={this.props.img}
          />
          <div>
            <p className="font-semibold">{this.props.name}</p>
            <p className="leading-tight text-gray-400 font-normal">{this.props.role}</p>
            {/* TODO: Add social bar/symbols */}
            <ul className="flex pt-1 text-teal-500 text-base">
              <li className="px-1" key="1">
                <a href={this.props.linkedin}>
                  <LinkedInIcon width="6"/>
                </a>
              </li>
              <li className="px-1" key="2">
                <a href={this.props.twitter}>
                  <TwitterIcon width="6"/>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TeamMember;
