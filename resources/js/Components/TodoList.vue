<template>
    <div>
        <h2>My To-Do List</h2>
        <form @submit.prevent="addTask">
            <input v-model="newTask" type="text" placeholder="Add a new task" required />
            <button type="submit">Add Task</button>
        </form>
        <ul>
            <li v-for="task in tasks" :key="task.id">
                <input type="checkbox" v-model="task.completed" @change="updateTask(task)" />
                {{ task.task }}
                <button @click="deleteTask(task.id)">Delete</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tasks: [],      // Store tasks fetched from the API
            newTask: ''     // Store the new task input
        };
    },
    mounted() {
        this.fetchTasks();   // Fetch tasks when the component is mounted
    },
    methods: {
        // Fetch tasks from the API
        fetchTasks() {
            axios.get('/api/tasks')
                .then(response => {
                    this.tasks = response.data;
                })
                .catch(error => {
                    console.error("Error fetching tasks:", error);
                });
        },
        // Add a new task
        addTask() {
            axios.post('/api/tasks', { task: this.newTask })
                .then(response => {
                    this.tasks.push(response.data);  // Add the new task to the list
                    this.newTask = '';                // Clear the input field
                })
                .catch(error => {
                    console.error("Error adding task:", error);
                });
        },
        // Update task completion status
        updateTask(task) {
            axios.patch(`/api/tasks/${task.id}`, { completed: task.completed })
                .catch(error => {
                    console.error("Error updating task:", error);
                });
        },
        // Delete a task
        deleteTask(id) {
            axios.delete(`/api/tasks/${id}`)
                .then(() => {
                    this.tasks = this.tasks.filter(task => task.id !== id);  // Remove the deleted task from the list
                })
                .catch(error => {
                    console.error("Error deleting task:", error);
                });
        }
    }
};
</script>

<style scoped>
/* Add some basic styling for the todo list */
h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

form {
    margin-bottom: 1rem;
}

input[type="text"] {
    padding: 0.5rem;
    margin-right: 0.5rem;
    width: 200px;
}

button {
    padding: 0.5rem 1rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin: 0.5rem 0;
}

button {
    margin-left: 10px;
    background-color: #f44336;
}

button:hover {
    background-color: #e53935;
}

input[type="checkbox"] {
    margin-right: 10px;
}
</style>
