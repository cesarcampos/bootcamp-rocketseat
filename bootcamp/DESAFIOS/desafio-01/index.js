const express = require("express");
const server = express();

server.use(express.json());

let reqCount = 0;
const projects = [];

function countRequest(req, res, next) {
  reqCount++;
  console.log(reqCount);

  return next();
}

function existProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exist." });
  }

  return next();
}

server.get("/projects", countRequest, (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", countRequest, existProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.find(project => project.id === id).title = title;

  return res.json(projects);
});

server.delete("/projects/:id", countRequest, existProject, (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id === id);
  const idx = projects.indexOf(project);
  projects.splice(idx, 1);
  return res.json({ desc: "projeto excluido" });
});

server.post("/projects/", countRequest, (req, res) => {
  const { id } = req.body;
  const { title } = req.body;

  const project = {
    id: id,
    title: title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

server.post("/projects/:id/tasks", countRequest, existProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3001);
