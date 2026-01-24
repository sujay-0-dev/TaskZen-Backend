const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const TodoSchema = new mongoose.Schema({
  userId: Number,
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model("Todo", TodoSchema);

app.post('/users/:userId/todos', async (req, res) => {
  try {
    const todo = await Todo.create({
      userId: req.params.userId,
      title: req.body.title
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/users/:userId/todos', async (req, res) => {
  const todos = await Todo.find({ userId: req.params.userId });
  res.json(todos);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
