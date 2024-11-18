const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://lavanya:o7BNcsDNWqGmQpP5@cluster0.hqxu8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).send('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Invalid password');
  }
  const token = jwt.sign({ userId: user._id }, 'secret_key');
  res.send({ token });
});

app.post('/tasks', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const verified = jwt.verify(token, 'secret_key');
    const task = new Task({
      userId: verified.userId,
      description: req.body.description,
    });
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

app.get('/tasks', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const verified = jwt.verify(token, 'secret_key');
    const tasks = await Task.find({ userId: verified.userId });
    res.send(tasks);
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const verified = jwt.verify(token, 'secret_key');
    await Task.deleteOne({ _id: req.params.id, userId: verified.userId });
    res.send('Task deleted');
  } catch (error) {
    res.status(400).send('Invalid token');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
