const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];


let todos = [
  { id: 1, userId: 1, title: 'Learn Backend', completed: false },
  { id: 2, userId: 2, title: 'Practice Express', completed: true }
];

let nextTodoId = 3;


app.post('/users/:userId/todos', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { title } = req.body;

  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTodo = {
    id: nextTodoId++,
    userId,
    title,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});


app.get('/users/:userId/todos', (req, res) => {
  const userId = parseInt(req.params.userId);

  const userTodos = todos.filter(t => t.userId === userId);
  res.json(userTodos);
});


app.get('/users/:userId/todos/:id', (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = parseInt(req.params.id);

  const todo = todos.find(
    t => t.id === id && t.userId === userId
  );

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});


app.put('/users/:userId/todos/:id', (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = parseInt(req.params.id);

  const index = todos.findIndex(
    t => t.id === id && t.userId === userId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos[index] = {
    ...todos[index],
    ...req.body,
    id,
    userId
  };

  res.json(todos[index]);
});


app.delete('/users/:userId/todos/:id', (req, res) => {
  const userId = parseInt(req.params.userId);
  const id = parseInt(req.params.id);

  const index = todos.findIndex(
    t => t.id === id && t.userId === userId
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(index, 1);
  res.status(204).send();
});


app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
