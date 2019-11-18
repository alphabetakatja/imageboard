const express = require("express");
const app = express();
const db = require("./utils/db");

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages().then(results => {
        console.log(results.rows);
        // let url = results.rows[0].url;
        // let title = results.rows[0].title;
        let images = results.rows;
        res.json(images);
    });
});

app.listen(8080, () => console.log("Imageboard up and running!"));
