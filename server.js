import express from 'express';
import cors from 'cors';

// Create an instance of the Express application
const app = express();
const default_port = 3000; // Default port if not specified in environment variables
const PORT = process.env.PORT || default_port;

// Middleware
app.use(cors()); // Allow requests from React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// Tasks hold: { string name, bool completed, date dueDate, date creationDate }
// NOTE: creationDate serves as id because tasks can't have the same creationDate and it's unchangeable
let tasks = [
    { taskName: "Task 1", completed: false, dueDate: new Date(), creationDate: new Date() },
    { taskName: "Task 2", completed: true, dueDate: new Date(), creationDate: new Date() },
    { taskName: "Task 3", completed: false, dueDate: new Date(), creationDate: new Date() }
]; 

// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Create task
app.post('/tasks', (req, res) => {
    const { taskName, completed, dueDate } = req.body;
    const newTask = { taskName, completed, dueDate: new Date(dueDate), creationDate: new Date() };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Remove task
app.delete('/tasks/:creationDate', (req, res) => {
    const creationDate = new Date(req.params.creationDate);
    tasks = tasks.filter(task => task.creationDate.getTime() !== creationDate.getTime());
    res.status(204).send();
});

// Update task name or due date
app.put('/tasks/:creationDate/update', (req, res) => {
    const creationDate = new Date(req.params.creationDate);
    const { taskName, dueDate } = req.body;
    const task = tasks.find(task => task.creationDate.getTime() === creationDate.getTime());

    if (!task) { // Task not found
        return res.status(404).json({ message: 'Task not found' });
    }

    // Update task properties if provided
    if (taskName) task.taskName = taskName;
    if (dueDate) task.dueDate = new Date(dueDate);

    res.json(task);
});

// Toggle completion status
app.put('/tasks/:creationDate/complete', (req, res) => {
    const creationDate = new Date(req.params.creationDate);
    const task = tasks.find(task => task.creationDate.getTime() === creationDate.getTime());

    if (!task) { // Task not found
        return res.status(404).json({ message: 'Task not found' });
    }

    // Toggle the completion status
    task.completed = !task.completed;

    res.json(task); 
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
