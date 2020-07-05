module.exports = {
  name: 'Restart Bot',
  section: 'Bot Client Control',

  subtitle (data) {
    return `Restarts ${data.filename}`
  },

  fields: ['filename'],

  html (isEvent, data) {
    return `
<div>
</div><br>
<div style="float: left; width: 105%;">
	Your main bot file:<br>
	<input id="filename" class="round" type="text" value="bot.js"><br>
</div>
<div><br>
	<p><u>NOTE:</u><br>
		Any action that is below this mod will not be executed!</p>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const filename = this.evalMessage(data.filename, cache)
    this.getDBM().Bot.bot.destroy()
    const child = require('child_process')
    child.execSync(`node ${filename}`, { cwd: require('path').dirname(process.argv[1]), stdio: [0, 1, 2] }).catch((e) => console.log(`An error in Restart Bot MOD: ${e}`))
  },

  mod () {}
}
