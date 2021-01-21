import React from "react";

class Mentor extends React.Component {
  render() {
    return (
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 z-0 hover:z-10 p-2">
        <a className="block h-full" href={this.props.link}>
          <div className="h-full flex flex-wrap xs:flex-no-wrap sm:flex-wrap px-8 md:px-8 py-8 md:py-12 bg-white shadow hover:shadow-lg group rounded cursor-pointer">
            <img
              className="h-24 w-24 sm:h-32 sm:w-32 mx-auto xs:mr-4 xs:ml-0 sm:mx-auto object-cover rounded-full border-white group-hover:border-teal-500 border-4"
              src={this.props.img}
            />
            <div className="w-full xs:w-2/3 sm:w-full sm:mt-4 text-center xs:text-left sm:text-center self-center">
              <h2 className="text-lg md:text-xl text-gray-700 group-hover:text-teal-500 font-semibold truncate">
                {this.props.name}
              </h2>
              <p className="text-gray-600 truncate">{this.props.company}</p>
              <p className="text-sm text-gray-600 truncate">{this.props.role}</p>
            </div>
          </div>
        </a>
      </div>
    );
  }
}

export default Mentor;
