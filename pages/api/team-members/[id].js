import { q, client } from "@/utils/fauna";

export default async function teamMemberById(req, res) {
  switch (req.method) {
    case "PUT":
      try {
        const teamMemberRes = await client.query(
          q.Update(q.Ref(q.Collection("TeamMembers"), req.query.id), {
            data: { ...req.body },
          })
        );
        res.status(200).json(teamMemberRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
      break;
    case "DELETE":
      try {
        const teamMemberRes = await client.query(
          q.Delete(q.Ref(q.Collection("TeamMembers"), req.query.id))
        );
        res.status(200).json(teamMemberRes);
      } catch (error) {
        res.status(error.status || 500).end(error.message);
      }
      break;
  }
}
