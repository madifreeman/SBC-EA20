import imageUrlBuilder from "@sanity/image-url";
import client from "@/utils/sanity";

const urlBuilder = (source) => {
    const builder = imageUrlBuilder(client).image(source);
    return builder.url();
  }

export default urlBuilder;