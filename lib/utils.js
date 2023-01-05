module.exports = {
	stringToBoolean: function (stringValue) {
		switch (stringValue?.toLowerCase()?.trim()) {
			case 'true':
				return true;
			case 'false':
				return false;
			default:
				return stringValue;
		}
	},
};
