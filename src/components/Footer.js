import React from "react";
import {InstagramIcon, YoutubeIcon, LinkedInIcon, TwitterIcon, FacebookIcon} from "../../public/icons";


class Footer extends React.Component {
  iconWidth = 6;
  render() {
    return (
      <footer>
        <div className="mt-4 p-8 text-center bg-gradient-to-r from-teal-500 to-teal-600">
          <div>
            <h1 className="mt-8 text-white font-bold text-3xl">
              Want to become a mentor at Startupbootcamp?
            </h1>
            <h2 className="mt-5 text-teal-100 text-lg">
              Give back to the startup community by sharing your knowledge and
              experience.
            </h2>
          </div>
          <div className="flex justify-center mt-4">
            <a
              href="#"
              className="btn hover:bg-gray-800 text-white border-white hover:bg-gray-800"
            >
              Learn More
            </a>
            <a
              href="#"
              className="btn hover:bg-gray-800 text-teal-500 bg-white  border-white  hover:text-white"
            >
              Register Now
            </a>
          </div>
        </div>
        <div className="w-full text-white bg-gray-800">
          <div className="container flex flex-wrap items-center justify-between py-16 mx-auto">
            <div className="flex flex-wrap">
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.energyaustralia.com.au/"
                target="_blank"
              >
                <img src="/images/partners/ea.png" alt="Energy Australia"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.spotless.com"
                target="_blank"
              >
                <img src="/images/partners/spotless.png" alt="Spotless"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.ausnetservices.com.au"
                target="_blank"
              >
                <img
                  src="/images/partners/ausnet.png"
                  alt="AusNet Services"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://dius.com.au"
                target="_blank"
              >
                <img src="/images/partners/dius.png" alt="Dius"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.australia.gov.au"
                target="_blank"
              >
                <img
                  src="/images/partners/aus-gov.png"
                  alt="Australian Government"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.vic.gov.au"
                target="_blank"
              >
                <img
                  src="/images/partners/vic-gov.png"
                  alt="Victorian Government"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.melbourne.vic.gov.au"
                target="_blank"
              >
                <img
                  src="/images/partners/com.png"
                  alt="City of Melbourne"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.khq.com.au"
                target="_blank"
              >
                <img src="/images/partners/khq.png" alt="KHQ Lawyers"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.pitcher.com.au"
                target="_blank"
              >
                <img src="/images/partners/pp.png" alt="Pitcher Partners"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://affix.com.au/"
                target="_blank"
              >
                <img
                  src="/images/partners/affix.png"
                  alt="affix Recruitment"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="http://ybfventures.com"
                target="_blank"
              >
                <img src="/images/partners/ybf.png" alt="YBF Ventures"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://www.facet5global.com/"
                target="_blank"
              >
                <img src="/images/partners/facet5.png" alt="Facet 5"></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://aws.amazon.com"
                target="_blank"
              >
                <img
                  src="/images/partners/aws.png"
                  alt="Amazon Web Services"
                ></img>
              </a>
              <a
                className="w-1/2 px-6 sm:w-1/3 lg:w-1/4 xl:w-1/5"
                href="https://stripe.com/au"
                target="_blank"
              >
                <img src="/images/partners/stripe.png" alt="Stripe"></img>
              </a>
            </div>
          </div>
          <div className="py-6 border-t border-gray-700">
            <div className="container flex flex-wrap justify-center items-center py-4 mx-auto md:justify-between md:py-0">
              <p className="mt-4 px-6 text-sm text-gray-500 md:mt-0">
                Copyright © 2019 Startupbootcamp Australia. All rights reserved.
              </p>
              <ul className="flex items-center order-first md:order-last text-gray-500">
                <li className="p-2 hover:text-teal-400">
                  <a href="https://www.facebook.com/sbcAUS">
                    <FacebookIcon width={this.iconWidth}/>
                  </a>
                </li>
                <li className="p-2 hover:text-teal-400">
                  <a href="https://twitter.com/sbcenergyaus">
                    <TwitterIcon width={this.iconWidth}/>
                  </a>
                </li>
                <li className="p-2 hover:text-teal-400">
                  <a href="https://www.linkedin.com/showcase/startupbootcamp-australia/">
                  <LinkedInIcon width={this.iconWidth}/>
                  </a>
                </li>
                <li className="p-2 hover:text-teal-400">
                  <a href="https://www.youtube.com/channel/UChzXM1nvKInDPbsYo5jMisg/">
                    <YoutubeIcon width={this.iconWidth}/>
                  </a>
                </li>
                <li className="p-2 hover:text-teal-400">
                  <a href="https://www.instagram.com/sbcaus/">
                    <InstagramIcon width={this.iconWidth}/>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
