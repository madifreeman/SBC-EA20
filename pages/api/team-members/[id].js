import client from "@/utils/sanity";

export default async function teamMemberById(req, res) {
  console.log(req.body);
  switch (req.method) {
    case "PUT":
      client
        .patch(req.body.id)
        .set(req.body.set)
        .commit()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.error("Oh no, the update failed: ", err.message);
        });
      break;
    case "DELETE":
      console.log("deleting")
      client
        .delete(req.body.id)
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.error("Delete failed: ", err.message);
        });
      break;
  }
}
