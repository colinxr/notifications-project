<script>
import { getServiceStore } from '@/plugins/FeathersAPI';

export default {
	name: 'App',

	async created() {
		if (!this.$route.query.userId) {
			await this.$router.replace({ query: { ...this.$route.query, userId: 1 } });
		}

		const Notifications = getServiceStore('user/notifications');

		await Notifications.fetchForUser(this.$route.query.userId);

		console.log();

		console.log(Notifications.all);
		// Perform any other actions
	}
};

// to do - front-end
// 1. build nav bar
// 2. on click open notification pane
// 3. build card component

// to do -- hook up
// 1. set current user as userId query param in url
// 2. onMounted fetch notifications for the current user
// 3. Pass those notifications into the notifications pane
// 4. Any unread notifications get send to modal
</script>

<template>
	<router-view />
</template>

<style lang="scss"></style>
