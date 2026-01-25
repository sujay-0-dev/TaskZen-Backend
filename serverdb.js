const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err.message));

const TodoSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

app.post('/users/:userId/todos', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const newTodo = await Todo.create({
      userId,
      title,
      completed: false
    });

    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:userId/todos', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:userId/todos/:id', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = req.params.id;

  try {
    const todo = await Todo.findOne({ _id: id, userId });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Invalid Todo ID' });
  }
});

app.put('/users/:userId/todos/:id', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = req.params.id;

  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: 'Invalid Todo ID' });
  }
});

app.delete('/users/:userId/todos/:id', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = req.params.id;

  try {
    const deletedTodo = await Todo.findOneAndDelete({ _id: id, userId });

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Invalid Todo ID' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
