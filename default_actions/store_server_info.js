module.exports = {
	name: "Store Server Info",
	section: "Server Control",

	subtitle: function(data) {
		const servers = [
			"Current Server", "Temp Variable", "Server Variable", "Global Variable"
		];
		const info = ["Server Object", "Server ID", "Server Name", "Server Name Acronym", "Server Region", "Server Icon URL", "Server Verification Level", "Server Default Channel", "Server AFK Channel", "Server System Channel", "Server Default Role", "Server Owner Member", "Server Bot Member Object", "Server Channel List", "Server Role List", "Server Member List", "Server Emoji List", "Server Member Count", "Creation Date", "Time To AFK", "Is Server Available?", "More than 250 members?", "Date Bot Joined Server", "Channel Amount", "Emoji Amount", "Embed Links", "DND Members Count", "Online Members Count (fixed)", "Offline Members Count", "Idle Members Count", "Total Bots Count In Server", "Server Channel IDs", "Server Role IDs", "Server Member IDs", "Server Bot Member Count", "Server Human Member Count", "Server Member Count", "Role Count", "Text Channel Count", "Voice Channel Count", "Is Server Verified?", "Banned Users List", "Invite List", "Server Explicit Content Filter", "Server Booster Count", "Server Premium Tier"];
		return `${servers[parseInt(data.server)]} - ${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch (info) {
			case 0: // Object
				dataType = "Guild Object";
				break;
			case 1: // ID
				dataType = "Guild ID";
				break;
			case 2: // Name
			case 3: // Name Acronym
			case 4: // Region
				dataType = "Text";
				break;
			case 5: // Icon URL
				dataType = "Image URL";
				break;
			case 6:  // Verification Level
			case 43: // Explicit Content Filter. Added by Cap in 1.9.6
			case 17: // Server Member Count
			case 19: // Time To AFK
			case 23: // Channel Amount.
			case 24: // Emoji Amount.
			case 26: // DND Members Count.
			case 27: // Online Members Count. (fixed)
			case 28: // Offline Members Count.
			case 29: // Idle Members Count.
			case 30: // Total Bots Count In Server.
			case 34: // Server Bot Member Count.
			case 35: // Server Human Member Count.
			case 36: // Server Member Count. //Added by Lasse in
			case 37: // Role Count.
			case 38: // Text Channel
			case 39: { // Voice Channel
				dataType = "Number";
				break; }
			case 7: // Default Channel
			case 8: // AFK Channel
			case 9: // System Channel
				dataType = "Channel";
				break;
			case 10: // Default Role
				dataType = "Role";
				break;
			case 11: // Owner Member
			case 12: // Bot Member Object
				dataType = "Guild Member";
				break;
			case 13: // Channel List
				dataType = "List";
				break;
			case 14: // Role List
				dataType = "List";
				break;
			case 15: // Member List
				dataType = "List";
				break;
			case 16: // Emoji List
				dataType = "List";
				break;
			case 18: // Creation Date
			case 22: // Date bot Joined Server.
				dataType = "Date";
				break;
			case 20: // Is Server Avilable?
			case 21: // More Than 250 Members? //Deprecated in v1.8.5
			case 25: // Embed Links.
				dataType = "Boolean";
				break;
			case 31: // Server Channel IDs.
				dataType = "List";
				break;
			case 32: // Server Roles IDs.
				dataType = "List";
				break;
			case 33: // Server Member IDs.
				dataType = "List";
				break;
			case 40: // Verified?
				dataType = "Boolean";
				break;
			case 41: // Collection of banned users
			case 42: //	Collection of guild invites
				dataType = "List";
				break;
			case 44: // Server Boost Count
				dataType = "Number";
				break;
			case 45: // Server Premium Tier
				dataType = "Number";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["server", "varName", "info", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
		<div><p>This action has been modified by DBM Mods.</p></div><br>
		<div>
			<div style="float: left; width: 35%;">
				Source Server:<br>
				<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
					${data.servers[isEvent ? 1 : 0]}
				</select>
			</div>
			<div id="varNameContainer" style="display: none; float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text" list="variableList"><br>
			</div>
		</div><br><br><br>
		<div>
			<div style="padding-top: 8px; width: 70%;">
				Source Info:<br>
				<select id="info" class="round">
					<optgroup label="Standard DBM">
						<option value="0" selected>Server Object</option>
						<option value="1">Server ID</option>
						<option value="2">Server Name</option>
						<option value="3">Server Name Acronym</option>
						<option value="4">Server Region</option>
						<option value="5">Server Icon URL</option>
						<option value="6">Server Verification Level</option>
						<option value="43">Server Explicit Content Filter</option>
						<option value="7">Server Default Channel</option>
						<option value="8">Server AFK Channel</option>
						<option value="9">Server System Channel</option>
						<option value="10">Server Default Role</option>
						<option value="11">Server Owner Member</option>
						<option value="12">Server Bot Member Object</option>
						<option value="13">Server Channel List</option>
						<option value="14">Server Role List</option>
						<option value="15">Server Member List</option>
						<option value="16">Server Emoji List</option>
					</optgroup>
					<optgroup label="Creation/Join Dates">
						<option value="18" selected>Servers Creation Date</option>
						<option value="22">Date Bot Joined</option>
					</optgroup>
					<optgroup label="Member Infos">
						<!--<option value="17">Server Member Count</option>-->
						<option value="30">Total Bots in Servers</option>
						<option value="34">Bot Count (Same as Total Bots In Servers)</option>
						<option value="35">Human Member Count</option>
						<option value="36">Member Count</option>
                        			<option value="41">Banned Member List</option>
					</optgroup>
					<optgroup label="Member Status Infos">
						<option value="27">Online Members Count</option>
						<option value="29">Idle Members Count</option>
						<option value="26">DND Members Count</option>
						<option value="28">Offline Members Count</option>
					</optgroup>
					<optgroup label="ID Infos">
						<option value="31">Server Channel IDs</option>
						<option value="32">Server Role IDs</option>
						<option value="33">Server Member IDs</option>
					</optgroup>
					<optgroup label="Channel Infos">
						<option value="23">Channel Amount</option>
						<option value="38">Text Channel Count</option>
						<option value="39">Voice Channel Count</option>
					</optgroup>
					<optgroup label="Other">
						<option value="40">Is Server Verified?</option>
						<option value="19">Time User gets AFK</option>
						<option value="20">Is Server available?</option>
						<option value="24">Emoji Amount</option>
						<option value="25">Embeds links?</option>
						<option value="37">Role Count</option>
                        			<option value="42">Invite List</option>
                        			<option value="44">Server Boost Count</option>
                        			<option value="45">Server Boost Tier</option>
					</optgroup>
					<!--<option value="21">More Than 250 Members?</option>-->
				</select>
			</div>
		</div><br>
		<div>
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer2" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName2" class="round" type="text"><br>
			</div>
		</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.serverChange(document.getElementById("server"), "varNameContainer");
	},

	action: async function(cache) {
		const data = cache.actions[cache.index];
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const info = parseInt(data.info);
		const targetServer = this.getServer(server, varName, cache);
		if (!targetServer) {
			this.callNextAction(cache);
			return;
		}
		let result;
		switch (info) {
			case 0: // Object
				result = targetServer;
				break;
			case 1: // ID
				result = targetServer.id;
				break;
			case 2: // Name
				result = targetServer.name;
				break;
			case 3: // Name Acronym
				result = targetServer.nameAcronym;
				break;
			case 4: // Region
				result = targetServer.region;
				break;
			case 5: // Icon URL
				result = targetServer.iconURL();
				break;
			case 6: // Verification Level
				result = targetServer.verificationLevel;
				break;
			case 7: // Default Channel.
				result = targetServer.getDefaultChannel();
				break;
			case 8: // AFK Channel
				result = targetServer.afkChannel;
				break;
			case 9: // System Channel
				result = targetServer.systemChannel;
				break;
			case 10: // Default Role
				result = targetServer.roles.everyone;
				break;
			case 11: // Owner Member
				result = targetServer.owner;
				break;
			case 12: // Bot Member
				result = targetServer.me;
				break;
			case 13: // Channel List
				result = targetServer.channels.array();
				break;
			case 14: // Role List
				result = targetServer.roles.cache.array();
				break;
			case 15: // Member List
				result = targetServer.members.cache.array();
				break;
			case 16: // Emoji List
				result = targetServer.emojis.cache.array();
				break;
			case 17: // Member Count
				result = targetServer.members.cache.size;
				break;
			case 18: // Creation Date.
				result = targetServer.createdAt;
				break;
			case 19: // Time To AFK.
				result = targetServer.afkTimeout;
				break;
			case 20: // Is Server Avilable?
				result = targetServer.available;
				break;
			case 21: // More Than 250 Members? // Deprecated in v1.8.5
				result = targetServer.large;
				break;
			case 22: // Date bot Joined Server.
				result = targetServer.joinedAt;
				break;
			case 23: // Channel Amount.
				result = targetServer.channels.cache.array().length;
				break;
			case 24: // Emoji Amount.
				result = targetServer.emojis.cache.array().length;
				break;
			case 25: // Embed Links.
				result = targetServer.embedEnabled;
				break;
			case 26: { // DND Members Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.filter((m) => m.user.presence.status == "dnd").size;
				break; }
			case 27: { // Online Members Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.filter((m) => m.user.presence.status == "online").size;
				break; }
			case 28: { // Offline Members Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.filter((m) => m.user.presence.status == "offline").size;
				break; }
			case 29: { // Idle Members Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.filter((m) => m.user.presence.status == "idle").size;
				break; }
			case 30: { // Total Bots Count In Server.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.filter((m) => m.user.bot).size;
				break; }
			case 31: { // Server Channel IDs.
				result = targetServer.channels.cache.map((channels) => channels.id);
				break; }
			case 32: { // Server Roles IDs.
				result = targetServer.roles.cache.map((roles) => roles.id);
				break; }
			case 33: { // Server Member IDs.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.map((members) => members.id);
				break; }
			case 34: { // Server Bot Member Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.filter((m) => m.user.bot == true).size;
				break; }
			case 35: { // Server Human Member Count.
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.members.cache.filter((m) => m.user.bot == false).size;
				break; }
			case 36: { // Server Member Count. //Added by Lasse in 1.8.7
				if (targetServer.memberCount !== targetServer.members.cache.size) {
					await targetServer.members.fetch(); // ensures it fetches. updated to await.
				}
				result = targetServer.memberCount;
				break; }
			case 37: { // Role Count.
				result = targetServer.roles.cache.size;
				break; }
			case 38: { // Text Channel Count.
				result = targetServer.channels.cache.filter((c) => c.type == "text").size;
				break; }
			case 39: { // Voice Channel Count.
				result = targetServer.channels.cache.filter((c) => c.type == "voice").size;
				break; }
			case 40: { // Is Server Verified?
				result = targetServer.verified;
				break; }
			case 41: { // Collection of banned users.
				const bans = await targetServer.fetchBans();
				result = bans.array();
				break; }
			case 42: { // Collection of guild invites.
				const invites = await targetServer.fetchInvites();
				result = invites.array();
				break; }
			case 43: { // Explicit Content Filter.
				result = targetServer.explicitContentFilter;
				break; }
			case 44: {
				result = targetServer.premiumSubscriptionCount || 0;
				break; }
			case 45: {
				result = targetServer.premiumTier || 0;
				break; }
			default: { // Fixed Spacing.
				break; }
		}
		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};
