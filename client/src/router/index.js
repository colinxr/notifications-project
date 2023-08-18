import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/Home.vue')
		},
		{
			path: '/about',
			name: 'about',
			component: () => import('../views/About.vue')
		}
	]
});

router.beforeEach((to, from, next) => {
	const userId = to.query.userId;

	// If userId is not provided, set it to 1
	if (!userId) return next({ ...to, query: { ...to.query, userId: 1 } });

	return next();
});

export default router;
