module.exports = () => {
	return async (context) => {
		const { patientId, clinicianId } = context.data;

		if (!patientId || !clinicianId) {
			throw Error('Could not create a notification for this activity.');
		}

		const patient = await context.app.service('users').get(patientId, {
			query: { $select: ['id', 'firstName', 'lastName'] }
		});

		/* eslint-disable-next-line */
		const notification = await context.app.service('notifications').create(
			{
				title: `${patient.firstName} ${patient.lastName} just completed an activity`,
				publishedAt: new Date(),
				ctaUrl: `/patient/${patient.id}/homework`,
				type: 'event'
			},
			{
				userIds: [clinicianId]
			}
		);

		return context;
	};
};
