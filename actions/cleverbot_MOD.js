module.exports = {
  name: 'Cleverbot',
  section: 'Other Stuff',

  subtitle (data) {
    const WhichAPI = ['cleverbot.io', 'cleverbot.com']
    return `Speak with ${WhichAPI[parseInt(data.WhichAPI)]}!`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Clever Response'
    return ([data.varName2, dataType])
  },

  fields: ['WhichAPI', 'inputVarType', 'inputVarName', 'APIuser', 'APIkey', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
	<div style="width: 45%; padding-top: 8px;">
		API:<br>
			<select id="WhichAPI" class="round">
				<option value="0" selected>Cleverbot.io (free)</option>
				<option value="1">Cleverbot.com (free trial)</option>
			</select>
	</div>
</div><br>
<div>
	<div style="float: left; width: 35%;">
	   Input Variable:<br>
	   <select id="inputVarType" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
	   ${data.variables[1]}
	   </select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
	   Variable Name:<br>
	   <input id="inputVarName" class="round" type="text" list="variableList">
	</div>
	<br><br><br>
	<div style="float: left; width: 80%; padding-top: 8px;">
	   API User:<br>
	   <input id="APIuser" class="round" type="text" placeholder="Leave blank if you use cleverbot.com">
	</div><br>
	<div style="float: left; width: 80%; padding-top: 8px;">
	   API Key:<br>
	   <input id="APIkey" class="round" type="text">
	</div>
	<br><br><br>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Store Response In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
	<br><br><br><br><br>
	<div id="comment" style="padding-top: 30px; padding-top: 8px;">
		<p>
		<u>Which API should I use?</u><br>
		Cleverbot.io is completely free. You only have to sign in with an email to get an API key. But that bot is a little bit dumb. It is asking you the same questions on every start etc.<br>
		Cleverbot.com is much more clever. But it is only free for 5000 calls/questions. If you want more, you'll have to pay (or create a new account).<br><br>
		Get cleverbot.io key: https://cleverbot.io/keys<br>
		Get cleverbot.com key: http://www.cleverbot.com/api<br>
		Copy the links to your browser.<br>
		</p>
	</div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('inputVarType'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage'), 'varNameContainer2')
  },

  action (cache) {
    const _this = this

    const data = cache.actions[cache.index]
    const WhichAPI = parseInt(data.WhichAPI)

    const type = parseInt(data.inputVarType)
    const inVar = this.evalMessage(data.inputVarName, cache)
    const Input = this.getVariable(type, inVar, cache)

    const storage = parseInt(data.storage)
    const varName2 = this.evalMessage(data.varName2, cache)

    const Mods = this.getMods()

    switch (WhichAPI) {
      case 0:
        const ioAPIuser = this.evalMessage(data.APIuser, cache)
        const ioAPIkey = this.evalMessage(data.APIkey, cache)
        if (!ioAPIuser) return console.log('Please enter a valid API User key from cleverbot.io!')
        if (!ioAPIkey) return console.log('Please enter a valid API Key from cleverbot.io!')

        const cleverbotio = Mods.require('cleverbot.io')
        const CLEVERBOT = new cleverbotio(ioAPIuser, ioAPIkey)
        const session = CLEVERBOT.setNick('DBM Bot')

        CLEVERBOT.create((err, session) => {
          if (err) return console.log(`ERROR with cleverbot.io: ${err}`)
          CLEVERBOT.ask(Input, (err, response) => {
            if (err) return console.log(`ERROR with cleverbot.io: ${err}`)
            // Saving
            if (response !== undefined) {
              _this.storeValue(response, storage, varName2, cache)
            }
            _this.callNextAction(cache)
          })
        })

        break
      case 1:
        const cleverbotcom = Mods.require('cleverbot-node')
        const clbot = new cleverbotcom()
        const comAPIkey = this.evalMessage(data.APIkey, cache)

        if (!comAPIkey) return console.log('Please enter a valid API Key from cleverbot.com!')
        clbot.configure({ botapi: comAPIkey })

        clbot.write(Input, (response) => {
          if (response.output !== undefined) {
            _this.storeValue(response.output, storage, varName2, cache)
          } else {
            console.log("cleverbot.com doesn't like this. Check your API key and your input!")
          }
          _this.callNextAction(cache)
        })
        break
    }
  },

  mod () {}
}
