module.exports = {
  name: 'Blacklist Users',
  section: 'Other Stuff',
  subtitle (data) {
    const info = ['', 'Blacklist User', 'Un-Blacklist User']
    const vars = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${vars[parseInt(data.storage)]}: ${data.varName} | ${info[parseInt(data.type)]}`
  },
  fields: ['storage', 'varName', 'type'],
  html (isEvent, data) {
    return `
<div>
	<div>
	<br>Operation Type:<br>
		<select class="round" id="type">
			<option value="1" selected>Blacklist User</option>
			<option value="2">Un-Blacklist User</option>
		</select><br>
		<div style="float: left; width: 47%">
			Variable Type:<br><select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 47%">
			Variable Name:<br>
			<input class="round" id="varName" />
		</div>
	</div>
</div>
	`
  },
  init () {},
  action (cache) {
    const data = cache.actions[cache.index]
    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    const type = parseInt(data.type)
    const user = this.getVariable(storage, varName, cache)
    const file = fs.readFileSync('./data/blacklist.txt', 'utf-8').toString()
    let users
    const fs = require('fs')
    if (!varName) {
      this.callNextAction(cache)
      return
    }
    switch (type) {
      case 1:
        users = file.split('\n')
        if (!users.includes(user.id)) {
          fs.appendFileSync('./data/blacklist.txt', `${user.id}\n`)
        }
        break
      case 2:
        users = file.split('\n')
        if (users.includes(user.id)) {
          console.log(users)
          console.log(users.filter((x) => x !== user.id))
          fs.writeFileSync('./data/blacklist.txt', users.filter((x) => x !== user.id).join('\n'))
        }
        break
      default:
        console.log("Update your blacklist_MOD.js, the selected option doesn't exist.")
        break
    }
  },
  mod (DBM) {
    const fs = require('fs')
    if (!fs.existsSync('./data/blacklist.txt')) {
      fs.writeFileSync('./data/blacklist.txt', '', (err) => {
        if (err) {
          console.log(err)
        }
      })
    }
    // MODIFY Bot.checkCommand to effectively check the blacklist
    DBM.Bot.checkCommand = function (msg) {
      let command = this.checkTag(msg.content)
      if (command) {
        if (!this._caseSensitive) {
          command = command.toLowerCase()
        }
        const cmd = this.$cmds[command]
        if (cmd) {
          const info = fs.readFileSync('./data/blacklist.txt').toString()
          if (!info.split('\n').includes(msg.member.id)) {
            DBM.Actions.preformActions(msg, cmd)
            return true
          }
          DBM.Bot.bot.emit('blacklistUserUse', msg.member || msg.author, msg)
        }
      }
      return false
    }
  }
}
