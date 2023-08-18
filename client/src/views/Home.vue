<script>
import { getServiceStore, serviceGetMixin, serviceFindMixin } from '@/plugins/FeathersAPI';
export default {
	name: 'Home',
	components: {},
	mixins: [
		// this mixin automatically gets an object, from the specified service, defined by the specified id
		// the fetch from the server is done in the created hook
		// a computed is defined, with the string provided to the name option, to access the result
		// if no name option is set, then it will use the singlular version of the camelCased service name
		serviceGetMixin({
			service: 'users',
			name: 'user1',
			id: 1
		}),
		// this mixin automatically finds objects, from the specified service, defined by the specified query
		// the fetch from the server is done in the created hook
		// a computed is defined, with the string provided to the name option, to access the result
		// if no name option is set, then it will use the camelCased service name
		serviceFindMixin({
			service: 'users',
			name: 'moreUsers',
			params: (vm) => ({
				query: {
					// WHERE id IN (3, 4, 5)
					id: {
						$in: [3, 4, 5]
					}
				}
			})
		})
	],
	data() {
		return {
			skip: 0, // used in fetchNextTwoUsers method
			fetchTwoPending: false
		};
	},
	computed: {
		user2() {
			// get user with specified id from store
			return getServiceStore('users').getFromStore(2);
		},
		remainingUsers() {
			// find users in store with specified query
			return getServiceStore('users').findInStore({
				query: {
					// WHERE id > 5
					id: {
						$gt: 5
					}
				}
			}).data;
		}
	},
	methods: {
		fetchUser2() {
			// get user from server with specified ID and load into store
			getServiceStore('users').get(2);
		},
		fetchNextTwoUsers() {
			this.fetchTwoPending = true;
			// find users from server with specified query and load into store
			getServiceStore('users')
				.find({
					query: {
						// WHERE id > 5
						id: {
							$gt: 5
						},
						$limit: 2,
						$skip: this.skip
					}
				})
				.then((result) => {
					this.fetchTwoPending = false;
					this.skip = result.total >= result.skip + result.limit ? this.skip + result.limit : this.skip;
				})
				.catch(() => {
					this.fetchTwoPending = false;
				});
		}
	}
};
</script>

<template>
	<div id="home">
		<div class="box">
			<h3>User1 - Fetched Automatically</h3>
			{{ user1 }}
		</div>
		<div class="box">
			<h3>User2 - <button @click="fetchUser2">Fetch Now</button></h3>
			{{ user2 }}
		</div>
		<div class="box">
			<h3>moreUsers - Fetched Automatically</h3>
			{{ moreUsers }}
		</div>
		<div class="box">
			<h3>remainingUsers - <button :disabled="fetchTwoPending" @click="fetchNextTwoUsers">Fetch Next Two</button></h3>
			{{ remainingUsers }}
		</div>
	</div>
</template>

<style lang="scss">
.box {
	padding: 15px;
	margin-bottom: 15px;
	border: 1px solid #ccc;
}
</style>
