const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// ---------- 1. GET - All Projects ----------
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ---------- 2. POST - New Project ----------
router.post('/', async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      technologies: req.body.technologies,
      githubLink: req.body.githubLink || '',
      status: req.body.status || 'In Progress',
      image: req.body.image || ''
    });
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------- 3. PUT - Update Project ----------
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    project.title = req.body.title || project.title;
    project.description = req.body.description || project.description;
    project.technologies = req.body.technologies || project.technologies;
    project.githubLink = req.body.githubLink || project.githubLink;
    project.status = req.body.status || project.status;
    project.image = req.body.image !== undefined ? req.body.image : project.image;
    
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ---------- 4. DELETE - Delete Project ----------
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;