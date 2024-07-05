import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    console.log(result);
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    let err = "";
    if (error.message.includes("429")) {
      err = "Too many requests, please retry after some time";
    } else {
      err = error.message;
    }
    res.render("index.ejs", {
      error: err,
    });
  }
});

app.post("/", async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.type || req.body.participants) {
      const type = req.body.type;
      const participants = req.body.participants;
      const response = await axios.get(
        `https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`
      );
      const result_table = response.data;
      const random = Math.floor(Math.random() * result_table.length);
      res.render("index.ejs", { data: result_table[random] });
    }

    else if(req.body.key){
      const key = req.body.key;
      const response = await axios.get(
        `https://bored-api.appbrewery.com/activity/${key}`
      );
      const result = response.data;
      res.render("index.ejs", { data: result });
    }

    else
    {
      res.redirect("/");
    }


  } catch (error) {
    console.error("Failed to make request:", error.message);
    let err = "";
    if (error.message.includes("404")) {
      err = "No activities that match your criteria";
    } else if (error.message.includes("429")) {
      err = "Too many requests, please retry after some time";
    } else {
      err = error.message;
    }
    res.render("index.ejs", {
      error: err,
    });
  }


});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
