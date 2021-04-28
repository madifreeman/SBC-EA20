import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'tvv8hfdz',
  dataset: process.env.SANITY_DATASET,
  apiVersion: '2021-03-25',
  useCdn: false, 
  token: process.env.SANITY_TOKEN
});