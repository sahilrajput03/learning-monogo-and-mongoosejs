module.exports = {
	//LEARN: Hot reloading of config file works really aweome as well, i.e, with debug flag and also with `refresh` files as well (100% GENUINE WAY OF WORKING! ~ Sahil).
	refresh: ['initMongodb.js', 'models.js'], // logger.js was causing some issue idk why, so added it to fullRefresh list as well.
	// debug:: You can have values like '', '--inspect', '--inspect-brk'.
	debug: '--inspect',
}
