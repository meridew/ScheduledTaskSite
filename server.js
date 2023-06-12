import express from 'express';
import { PowerShell } from 'node-powershell';

const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Route to get tasks
app.get('/getTasks', async (req, res) => {
    const result = await PowerShell.$`./getTasks.ps1`;
    const task = JSON.parse(result.raw);
    res.send(task);
});

// Route to run a task
app.get('/runTask/:id', async (req, res) => {
    const taskId = req.params.id;
    const output = await PowerShell.$`./runTask.ps1 ${taskId}`;
    res.send({ message: output });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
