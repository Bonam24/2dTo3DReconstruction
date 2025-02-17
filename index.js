// new code 
const express = require("express");
const path = require("path");

const app = express();

const Delaunator = require("delaunator");


app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("home");
});

app.post("/generate-mesh", (req, res) => {
  try {
      const points = JSON.parse(req.body.points);

      if (!Array.isArray(points) || points.length < 3) {
          return res.status(400).json({ error: "Invalid input. Need at least 3 points." });
      }

      // Perform Delaunay Triangulation
      const delaunay = Delaunator.from(points);
      const triangles = Array.from(delaunay.triangles); // ✅ Convert it to a plain array

      console.log("Generated Triangles:", triangles); // 🔍 Debugging log

      if (!Array.isArray(triangles) || triangles.length === 0) {
          return res.status(400).json({ error: "Triangulation failed. Check input points." });
      }

      res.json({ points, triangles });
  } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
