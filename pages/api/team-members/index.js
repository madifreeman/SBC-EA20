import client from '@/utils/sanity'

export default async function teamMember(req, res) {
  console.log(req.body)
  client.create(req.body).then((result) => {
    res.status(200).json(result);
  })
}
