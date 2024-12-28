<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = 'https://gzlxtizgbwkhecuqizlp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6bHh0aXpnYndraGVjdXFpemxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MjkyMDYsImV4cCI6MjA0NzQwNTIwNn0.7C6AblULh5VkM0GsZJ8xjd2vG1Wr6NVYDjK7j0dajm4'; // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey);

// Reactive state
const tasks = ref([]);
const newTask = ref('');
const editingTaskId = ref(null);
const editedTaskName = ref('');

// Fetch tasks from Supabase
const fetchTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('id', { ascending: true });

  if (!error) tasks.value = data || [];
};

// Add a new task
// Add a new task
const addTask = async () => {
  if (!newTask.value.trim()) return;

  const { data, error } = await supabase
    .from('tasks')
    .insert([{ task: newTask.value, completed: false }])
    .select('*'); // Ensure the inserted task is returned

  if (!error && data.length > 0) {
    tasks.value.push(data[0]); // Add the new task to the tasks array
  } else {
    console.error('Error adding task:', error);
  }

  newTask.value = ''; // Clear input
};


// Enable task editing
const enableEditTask = (task) => {
  editingTaskId.value = task.id;
  editedTaskName.value = task.task;
};

// Save edited task
const saveEditedTask = async (task) => {
  if (!editedTaskName.value.trim()) return;

  const { error } = await supabase
    .from('tasks')
    .update({ task: editedTaskName.value })
    .match({ id: task.id });

  if (!error) {
    task.task = editedTaskName.value;
    editingTaskId.value = null;
  }
};

// Delete a task
const deleteTask = async (id) => {
  const { error } = await supabase.from('tasks').delete().match({ id });

  if (!error) tasks.value = tasks.value.filter(task => task.id !== id);
};

// Update task completion
const toggleTaskCompletion = async (task) => {
  const { error } = await supabase
    .from('tasks')
    .update({ completed: task.completed })
    .match({ id: task.id });

  if (error) console.error('Error updating completion:', error);
};

// Fetch tasks on component mount
onMounted(fetchTasks);
</script>

<template>
  <Head title="Dashboard" />

  <AuthenticatedLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
    </template>

    <div class="py-12">
      <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden shadow-sm sm:rounded-lg">
          <div class="p-6">
            <h1 class="text-3xl font-bold">To-Do List</h1>

            <!-- Add Task Input -->
            <div class="mt-4 flex gap-4">
              <input
                v-model="newTask"
                placeholder="Add a new task"
                @keyup.enter="addTask"
                class="border border-white rounded px-3 py-2 w-full text-gray-800 focus:outline-none"
              />
              <button
                @click="addTask"
                class="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded text-white font-semibold transition"
              >
                Add Task
              </button>
            </div>

            <ul class="mt-4 space-y-4">
              <!-- List Tasks -->
              <li
                v-for="task in tasks"
                :key="task.id"
                class="flex items-center justify-between bg-white text-gray-800 p-4 rounded shadow-md"
              >
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="task.completed"
                    @change="toggleTaskCompletion(task)"
                    class="mr-2"
                  />
                  <template v-if="editingTaskId === task.id">
                    <input
                      v-model="editedTaskName"
                      @keyup.enter="saveEditedTask(task)"
                      @blur="saveEditedTask(task)"
                      class="border p-1 rounded flex-1"
                    />
                  </template>
                  <template v-else>
                    <span
                      :class="{ 'line-through text-gray-400': task.completed }"
                      @dblclick="enableEditTask(task)"
                      class="cursor-pointer"
                    >
                      {{ task.task }}
                    </span>
                  </template>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="enableEditTask(task)"
                    class="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteTask(task.id)"
                    class="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
