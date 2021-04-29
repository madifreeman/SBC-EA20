import client from "@/utils/sanity";

export default async function startupById(req, res) {
  switch (req.method) {
    case "PUT":
      if (req.body.set) {
        console.log("Setting");
        client
          .patch(req.body.id)
          .set(req.body.set)
          .commit()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.error("Update failed: ", err.message);
          });
      } else if (req.body.toInsert) {
        console.log("Inserting");
        const { at, position, items } = req.body.toInsert;
        client
          .patch(req.body.id)
          .insert(at, position, items)
          .commit()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            console.error("Update failed: ", err.message);
          });
      } else if (req.body.unset) {
        console.log("Unsetting ");
        console.log(req.body.unset);
        client
        .patch(req.body.id)
        .unset(req.body.unset)
        .commit()
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((err) => {
          console.error("Update failed: ", err.message);
        });
      }
      break;
  }
}
