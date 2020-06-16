module.exports = {
	name: "Store Message Params",
	section: "Messaging",

	subtitle: function(data) {
		const message = ["Command Message", "Temp Variable", "Server Variable", "Global Variable"];
		const info = ["One Parameter", "Multiple Parameters", "Mentioned User", "Mentioned Member", "Mentioned Role", "Mentioned Channel"];
		return `${message[parseInt(data.message)]} - ${info[parseInt(data.info)]} #${data.ParamN}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const info = parseInt(data.info);
		let dataType = "Unknown Type";
		switch(info) {
			case 0:
			case 1:
				dataType = "String";
				break;
			case 2:
				dataType = "User";
				break;
			case 3:
				dataType = "Member";
				break;
			case 4:
				dataType = "Role";
				break;
			case 5:
				dataType = "Channel";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["message", "varName", "info", "ParamN", "separator", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
<div id="DiVScroll" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
<div>
	<div style="float: left; width: 35%;">
		Source Message:<br>
		<select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
        Source Info:<br>
    	<select id="info" class="round" onchange="glob.onChange1(this)">
            <option value="0" selected>One Parameter</option>
            <option value="1">Multiple Parameters</option>
            <option value="2">Mentioned User</option>
		    <option value="3">Mentioned Member</option>
		    <option value="4">Mentioned Role</option>
		    <option value="5">Mentioned Channel</option>
        </select>
    </div>
	<div style="float: right; width: 60%;">
	    <span id="infoCountLabel">Parameter Number:</span><br>
	    <input id="ParamN" class="round" type="text" value="1">
    </div>
</div><br><br><br>
<div id="DiVseparator" style="padding-top: 8px;">
    <div style="float: left; width: 567px;">
	    Custom Parameter Separator:<br>
	    <input id="separator" placeholder="Read the Note below | Default Parameter Separator:" class="round" type="text">
    </div>
<br><br><br></div>
<div style="padding-top: 8px;">
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
</div>
<div style="float: left; width: 88%; padding-top: 8px;">
        <p>
        <b><span style="color:#ffffff; font-size: 20px;">Note:</span></b><br>
        Leave blank the Custom Parameter Separator if you want to use the Parameter Separator set in your DBM Settings<br>
        Custom Parameter Separator supports Regex
        </p>
</div><br><br><br><br><br><br><br><br><br>`;
	},

	init: function() {
		const { glob, document } = this;

		document.getElementById("separator").placeholder = "Read the Note below | Default Parameter Separator: " + JSON.parse(require("fs").readFileSync(JSON.parse(require("fs").readFileSync(__dirname.substr(0, __dirname.lastIndexOf("\\") + 1) + "settings.json", "utf8"))["current-project"] + "\\data\\settings.json", "utf8")).separator;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const infoCountLabel = document.getElementById("infoCountLabel");
			switch(value) {
				case 0:
					infoCountLabel.innerHTML = "Parameter Number:";
					document.getElementById("DiVseparator").style.display = null;
					document.getElementById("DiVScroll").style.overflowY = "scroll";
					break;
				case 1:
					infoCountLabel.innerHTML = "Starting From Parameter Number:";
					document.getElementById("DiVseparator").style.display = null;
					document.getElementById("DiVScroll").style.overflowY = "scroll";
					break;
				case 2:
					infoCountLabel.innerHTML = "User Mention Number:";
					document.getElementById("DiVseparator").style.display = "none";
					document.getElementById("DiVScroll").style.overflowY = "hidden";
					break;
				case 3:
					infoCountLabel.innerHTML = "Member Mention Number:";
					document.getElementById("DiVseparator").style.display = "none";
					document.getElementById("DiVScroll").style.overflowY = "hidden";
					break;
				case 4:
					infoCountLabel.innerHTML = "Role Mention Number:";
					document.getElementById("DiVseparator").style.display = "none";
					document.getElementById("DiVScroll").style.overflowY = "hidden";
					break;
				case 5:
					infoCountLabel.innerHTML = "Channel Mention Number:";
					document.getElementById("DiVseparator").style.display = "none";
					document.getElementById("DiVScroll").style.overflowY = "hidden";
					break;
				default:
					infoCountLabel.innerHTML = "";
					break;
			}
		};

		glob.onChange1(document.getElementById("info"));
		glob.messageChange(document.getElementById("message"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];

		const message = parseInt(data.message);
		const varName = this.evalMessage(data.varName, cache);
		const msg = this.getMessage(message, varName, cache);
		if(!msg) {
			console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Message doesn't exist`);
			this.callNextAction(cache);
			return;
		}

		const infoType = parseInt(data.info);

		const ParamN = this.evalMessage(data.ParamN, cache);
		if(ParamN == "") {
			console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Number has nothing`);
			this.callNextAction(cache);
			return;
		} else if(!/^[0-9]+$/.test(ParamN)) {
			console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Number isn't a number`);
			this.callNextAction(cache);
			return;
		}

		let separator;
		if(data.separator) {
			separator = this.evalMessage(data.separator, cache);
		} else {
			separator = this.getDBM().Files.data.settings.separator;
		}
		if(separator == "") {
			console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Parameter Separator has nothing`);
			this.callNextAction(cache);
			return;
		}

		let result;
		switch(infoType) {
			case 0:
				const params = msg.content.split(new RegExp(separator));
				if(params.length == 0) {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Nothing was found...`);
				} else {
					result = params[ParamN] || undefined;
				}
				break;
			case 1:
				let arrayy = [];
				var regex = new RegExp(separator, "g");
				while (rE = regex.exec(msg.content)) {
					arrayy.push(rE);
				}
				if(arrayy.length == 0) {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Nothing was found...`);
					break;
				}
				if(ParamN > arrayy.length || ParamN < 0) {
					result = undefined;
				} else if(ParamN == 0) {
					result = msg.content.substring(0, arrayy[ParamN].index);
				} else {
					result = msg.content.substring(arrayy[ParamN - 1].index + arrayy[ParamN - 1][0].length);
				}
				break;
			case 2:
				if(msg.mentions.users.array().length != 0) {
					const members = msg.mentions.users.array();
					if(members[ParamN - 1]) {
						result = members[ParamN - 1];
					}
				} else {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Doesn't exist users mentions...`);
				}
				break;
			case 3:
				if(msg.mentions.members.array().length != 0) {
					const members = msg.mentions.members.array();
					if(members[ParamN - 1]) {
						result = members[ParamN - 1];
					}
				} else {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Doesn't exist members mentions...`);
				}
				break;
			case 4:
				if(msg.mentions.roles.array().length != 0) {
					const roles = msg.mentions.roles.array();
					if(roles[ParamN - 1]) {
						result = roles[ParamN - 1];
					}
				} else {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Doesn't exist roles mentions...`);
				}
				break;
			case 5:
				if(msg.mentions.channels.array().length != 0) {
					const channels = msg.mentions.channels.array();
					if(channels[ParamN - 1]) {
						result = channels[ParamN - 1];
					}
				} else {
					result = undefined;
					console.log(`Action: #${cache.index + 1} | Store Message Params ERROR: Doesn't exist channels mentions...`);
				}
				break;
			default:
				break;
		}
		if(result) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			this.storeValue(result, storage, varName2, cache);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};
