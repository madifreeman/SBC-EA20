import React from "react";

class Startup extends React.Component {
  render() {
    return (
        <div className="w-full lg:w-1/2 z-0 hover:z-10 p-2">
          <a className="block h-full" href={this.props.link}>
            <div className="h-full flex flex-wrap items-center px-8 py-8 md:py-12 bg-white shadow hover:shadow-lg group rounded cursor-pointer">
              <img
                className="h-32 w-32 mx-auto mb-4 sm:ml-0 sm:mr-8 lg:mr-0 sm:mb-0 p-2 object-cover rounded-full border-gray-200 group-hover:border-teal-500 border-2"
                src={this.props.img}
              ></img>
              <div className="w-full sm:w-4/6 lg:pl-8 text-center sm:text-left">
                <h2 className="text-xl group-hover:text-teal-500 font-semibold">
                  {this.props.name}
                </h2>
                <p className="text-gray-500">{this.props.city + ", " + this.props.country}</p>
                <p className="pt-2">{this.props.description}</p>
              </div>
            </div>
          </a>  
      </div>
    );
  }
}

export default Startup;
