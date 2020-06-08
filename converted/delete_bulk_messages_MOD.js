module.exports = {
	name: "Delete Bulk Messages MOD",
	section: "Messaging",

	subtitle: function(data) {
		const channels = ["Same Channel", "Mentioned Channel", "1st Server Channel", "Temp Variable", "Server Variable", "Global Variable"];
		return `Delete ${data.count} messages from ${channels[parseInt(data.channel)] || "Nothing"}`;
	},

	fields: ["channel", "varName", "count", "option", "msgid", "Con0", "Con1", "Con2", "Con3", "Con4", "Con5", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
	<div>
		<div style="float: left; width: 35%;">
			Source Channel:<br>
			<select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		Amount to Delete:<br>
		<input id="count" class="round" type="text" style="width: 94%;"><br>
	</div>
	<div>
		<div style="float: left; width: 35%;">
			Delete Message:<br>
			<select id="option" class="round" onchange="glob.onChange2(this)">
				<option value="0" selected>None</option>
				<option value="1">Before The Message ID</option>
				<option value="2">After The Message ID</option>
				<option value="3">Around The Message ID</option>
			</select>
		</div>
		<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
			Message ID:<br>
			<input id="msgid" class="round" type="text"><br>
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 50%;">
			Exclude Author:<br>
			<input id="Con0" class="round" type="text" placeholder="Leave it blank for None."><br>
			Include Author:<br>
			<input id="Con1" class="round" type="text" placeholder="Leave it blank for None."><br>
		</div>
		<div style="padding-left: 3px; float: left; width: 49%;">
			Include Content:<br>
			<input id="Con3" class="round" type="text" placeholder="Leave it blank for None."><br>
			Custom:<br>
			<input id="Con4" class="round" type="text" placeholder="Leave it blank for None."><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 45%;">
			Embed Message:<br>
			<select id="Con2" class="round">
				<option value="0" selected>None</option>
				<option value="1">No</option>
				<option value="2">Yes</option>
			</select><br>
		</div>
		<div style=" padding-left: 32px; float: left; width: 49%;">
			Has Attachment:<br>
			<select id="Con5" class="round">
				<option value="0" selected>None</option>
				<option value="1">No</option>
				<option value="2">Yes</option>
			</select><br>
		</div>
	</div><br><br><br>
	<div>
		<div style="float: left; width: 40%;">
			If Delete Bulk Messages Fails:<br>
			<select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
			</select>
		</div>
		<div id="iffalseContainer" style="padding-left: 3%; display: none; float: left; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onChange2 = function(event) {
			const value = parseInt(event.value);
			const varNameInput = document.getElementById("varNameContainer2");
			if(value === 0) {
				varNameInput.style.display = "none";
			} else {
				varNameInput.style.display = null;
			}
		};
		glob.channelChange(document.getElementById("channel"), "varNameContainer");
		glob.onChange2(document.getElementById("option"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		let source;
		const channel = parseInt(data.channel);
		const msg = cache.msg;
		const varName = this.evalMessage(data.varName, cache);
		switch(channel) {
			case 0:
				if(msg) {
					source = msg.channel;
				}
				break;
			case 1:
				if(msg && msg.mentions) {
					source = msg.mentions.channels.first();
				}
				break;
			case 2:
				if(server) {
					source = server.channels.cache.first();
				}
				break;
			case 3:
				source = cache.temp[varName];
				break;
			case 4:
				if(server && this.server[server.id]) {
					source = this.server[server.id][varName];
				}
				break;
			case 5:
				source = this.global[varName];
				break;
		}
		let options = {};
		const msgid = parseInt(this.evalMessage(data.msgid, cache));
		const option = parseInt(data.option);
		switch(option) {
			case 1:
				options.before = msgid;
				break;
			case 2:
				options.after = msgid;
				break;
			case 3:
				options.around = msgid;
				break;
		}
		options.limit = Math.min(parseInt(this.evalMessage(data.count, cache)), 100);
		if(this.dest(source, "messages", "fetch")) {
			source.messages.fetch(options).then(function(messages) {
				let Con0 = this.evalMessage(data.Con0, cache);
				let Con1 = this.evalMessage(data.Con1, cache);
				let Con2 = this.evalMessage(data.Con2, cache);
				let Con3 = this.evalMessage(data.Con3, cache);
				let Con4 = this.evalMessage(data.Con4, cache);
				let Con5 = this.evalMessage(data.Con5, cache);
				if (Con0) {
					Con0 = Con0.replace(/\D/g, "");
					messages = messages.filter(function(element) {
						return element.author.id !== Con0;
					}, this);
				}
				if (Con1) {
					Con1 = Con1.replace(/\D/g, "");
					messages = messages.filter(function(element) {
						return element.author.id === Con1;
					}, this);
				}
				if (Con2 != 0) {
					messages = messages.filter(function(element) {
						if (Con2 == 1) {
							return element.embeds.length === 0;
						} else {
							return element.embeds.length !== 0;
						}
					}, this);
				}
				if (Con3) {
					messages = messages.filter(function(element) {
						return element.content.includes(Con3);
					}, this);
				}
				if (Con4) {
					messages = messages.filter(function(message) {
						let result = false;
						try {
							result = !!this.eval(Con4, cache);
						} catch(e) {}
						return result;
					}, this);
				}
				if (Con5 != 0) {
					messages = messages.filter(function(element) {
						if (Con5 == 1) {
							return element.attachments.size === 0;
						} else {
							return element.attachments.size !== 0;
						}
					}, this);
				}
				source.bulkDelete(messages)
					.then(() => this.callNextAction(cache))
					.catch((err) => {
						if (err.message == "You can only bulk delete messages that are under 14 days old.") {
							this.executeResults(false, data, cache);
						} else {
							this.displayError.bind(this, data, cache);
						}
					});
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};
