import express from "express";

const main = () => {
  const app = express();
  const port = process.env.PORT || 8000;

  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/static/page.html");
  });

  app.listen(port, () =>
    console.log(`Server on port ${port} is serving static files.`)
  );
};

main();
