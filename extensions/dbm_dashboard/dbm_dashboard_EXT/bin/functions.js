module.exports = function (Dashboard) {

	const chalk = Dashboard.requireModule('chalk'),
	path = Dashboard.requireModule('path'),
	figlet = Dashboard.requireModule('figlet'),
	fs = require('fs');

	Dashboard.onReady = function () {
		const config = require('../config.json')
		console.log("-------------------------------------------------------------------------------------------------");
		console.log(chalk.yellow(figlet.textSync('DBM Dashboard', { horizontalLayout: 'full' })));
		console.log("-------------------------------------------------------------------------------------------------");
		console.log(chalk.white('-'), chalk.red("Creator:"), chalk.white('Great Plains Modding'));
		console.log(chalk.white('-'), chalk.red("Version:"), chalk.white('1.0.0'));
		console.log(chalk.white('-'), chalk.red("Port:"), chalk.white(config.port));
		console.log(chalk.white('-'), chalk.red("isBotSharded:"), chalk.white(config.isBotSharded));
		console.log(chalk.white('-'), chalk.red("Client Secret:"), chalk.white(config.clientSecret));
		console.log(chalk.white('-'), chalk.red("Callback Url:"), chalk.white(config.callbackURL));
		console.log(chalk.white('-'), chalk.red("DBM Network:"), chalk.white('https://discord.gg/3QxkZPK'));
		console.log("-------------------------------------------------------------------------------------------------");
		console.log(chalk.white(chalk.green('- Success:'), `Dashboard started on port ${config.port}. http://localhost:${config.port}`));
		console.log(chalk.green(chalk.white('-'), 'Bot is ready!'));
	}

	Dashboard.dashboardConfig = function () {
		const dashboardConfigPath = path.join(process.cwd(), "extensions", "dbm_dashboard_EXT", "config.json");
		if (!fs.existsSync(dashboardConfigPath)) {
			let configPlate = {
				port: 3000,
				isBotSharded: false,
				tokenSecret: Math.random().toString(36).substr(2),
				clientSecret: '',
				callbackURL: `http://localhost:3000/dashboard/callback`,
				owner: '',
				theme: "default",
				isGlitch: false,
				navItems: [{
						name: "Home Page",
						link: "/"
					},
					{
						name: "Dashboard",
						link: "/dashboard/@me"
					},
					{
						name: "Admin Panel",
						link: "/dashboard/admin"
					}
				],
				inviteLink: "/dashboard/@me",
				supportServer: "https://discord.gg/3QxkZPK",
				introText: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!",
				footerText: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!",
				featureOne: {
					name: "Feature One",
					description: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!"
				},
				featureTwo: {
					name: "Feature Two",
					description: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!"
				},
				featureThree: {
					name: "Feature Three",
					description: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!"
				},
				featureFour: {
					name: "Feature Four",
					description: "You can replace this text with whatever you want. After you do that this will automatically show up on your website!"
				}
			};
			let settings = JSON.stringify(configPlate);
			fs.writeFileSync(dashboardConfigPath, settings);
			const config = require('../config.json');
			return config;
		} else {
			const config = require('../config.json');
			return config;
		};
	};
};