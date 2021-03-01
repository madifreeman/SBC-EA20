import { q, client } from "@/utils/fauna";

export default async function startupById(req, res) {
  switch (req.method) {
    case "DELETE":
      try {
        const startupRes = await client.query(
          q.Delete(q.Ref(q.Collection("Startups"), req.query.id))
        );
        res.status(200).json(startupRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
      break;
    case "PUT":
      try {
        const startupRes = await client.query(
          q.Update(q.Ref(q.Collection("Startups"), req.query.id), {
            data: { ...req.body },
          })
        );
        res.status(200).json(startupRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message)
      }
  }
}
