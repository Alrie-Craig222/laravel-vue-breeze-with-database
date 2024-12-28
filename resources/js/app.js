import './bootstrap';
import '../css/app.css';
import { createApp, h } from 'vue';  // Import 'h' here
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy';
import TodoList from './components/TodoList.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Create Inertia App
createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        const app = createApp({ render: () => h(App, props) })  // Use 'h' here to render the component
            .use(plugin)
            .use(ZiggyVue);

        // Mount the TodoList component inside your Inertia app
        app.component('todo-list', TodoList);

        app.mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
