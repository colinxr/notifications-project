import './assets/main.css';

import { createApp } from 'vue';

import FeathersAPI from '@/plugins/FeathersAPI';
import { getServiceStore } from '@/plugins/FeathersAPI';

import services from './stores/services';
import router from './router';

import App from './App.vue';
const app = createApp(App);

app.use(FeathersAPI, {
	apis: [
		{
			name: 'api',
			url: 'http://localhost:3030',
			idField: 'id',
			whitelist: ['$regex', '$options'],
			services: services,
			auth: {
				userService: 'users'
			}
		}
	]
});

const auth = getServiceStore('auth');
Promise.all([auth.authenticate()])
	.catch(() => {})
	// Render the app
	.then(() => {
		app.use(router);

		app.mount('#app');
	});
