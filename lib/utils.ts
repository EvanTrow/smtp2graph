export const stringToBoolean = (value: string | undefined) => {
	switch (value?.toLowerCase()?.trim()) {
		case 'true':
			return true;
		case 'false':
			return false;
		default:
			return value;
	}
};
