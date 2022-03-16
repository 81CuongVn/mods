module.exports = {
  name: 'Set Role Permissions',
  section: 'Role Control',
  meta: {
    version: '2.1.1',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_role_perms_MOD.js',
  },

  subtitle(data) {
    const roles = [
      'Mentioned Role',
      '1st Author Role',
      '1st Server Role',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = ['Granted', 'Denied'];
    const perm = [
      'Administrator',
      'Manage Guild',
      'Manage Nicknames',
      'Manage Roles',
      'Manage Emojis',
      'Kick Members',
      'Ban Members',
      'View Audit Log',
      'Change Nickname',
      'Create Instant Invite',
      'Priority Speaker',
      'Manage Channel',
      'Manage Webhooks',
      'Read Messages',
      'Send Messages',
      'Send TTS Messages',
      'Manage Messages',
      'Embed Links',
      'Attach Files',
      'Read Message History',
      'Mention Everyone',
      'Use External Emojis',
      'Add Reactions',
      'Connect to Voice',
      'Speak in Voice',
      'Mute Members',
      'Deafen Members',
      'Move Members',
      'Use Voice Activity',
      'All Permissions',
      'Stream',
    ];
    return `${roles[data.role]} - ${perm[data.permission]} - ${index[data.state]} ${
      !data.reason ? '' : `with Reason: <i>${data.reason}<i>`
    }`;
  },

  fields: ['role', 'varName', 'permission', 'state', 'reason'],

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Role:<br>
    <select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
      ${data.roles[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 45%;">
    Permission:<br>
    <select id="permission" class="round">
      <option value="0" selected>Administrator</option>
      <option value="1">Manage Guild</option>
      <option value="2">Manage Nicknames</option>
      <option value="3">Manage Roles</option>
      <option value="4">Manage Emojis</option>
      <option value="5">Kick Members</option>
      <option value="6">Ban Members</option>
      <option value="7">View Audit Log</option>
      <option value="8">Change Nickname</option>
      <option value="9">Create Instant Invite</option>
      <option value="10">Priority Speaker</option>
      <option value="11">Manage Channel</option>
      <option value="12">Manage Webhooks</option>
      <option value="13">Read Messages</option>
      <option value="14">Send Messages</option>
      <option value="15">Send TTS Messages</option>
      <option value="16">Manage Messages</option>
      <option value="17">Embed Links</option>
      <option value="18">Attach Files</option>
      <option value="19">Read Message History</option>
      <option value="20">Mention Everyone</option>
      <option value="21">Use External Emojis</option>
      <option value="22">Add Reactions</option>
      <option value="23">Connect to Voice</option>
      <option value="24">Speak in Voice</option>
      <option value="25">Mute Members</option>
      <option value="26">Deafen Members</option>
      <option value="27">Move Members</option>
      <option value="28">Use Voice Activity</option>
      <option value="29">All Permissions</option>
      <option value="30">Stream</option>
    </select>
  </div>
  <div style="padding-left: 5%; float: left; width: 55%;">
    Change To:<br>
      <select id="state" class="round">
      <option value="0" selected>Granted</option>
      <option value="1">Denied</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Reason:<br>
  <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.roleChange(document.getElementById('role'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.role, 10);
    const varName = this.evalMessage(data.varName, cache);
    const role = await this.getRole(storage, varName, cache);
    const info = parseInt(data.permission, 10);
    const reason = this.evalMessage(data.reason, cache);

    const options = {};
    options[data.permission] = data.state === '0';

    let result;
    switch (info) {
      case 0:
        result = 8n;
        break;
      case 1:
        result = 32n;
        break;
      case 2:
        result = 134217728n;
        break;
      case 3:
        result = 268435456n;
        break;
      case 4:
        result = 1073741824n;
        break;
      case 5:
        result = 2n;
        break;
      case 6:
        result = 4n;
        break;
      case 7:
        result = 128n;
        break;
      case 8:
        result = 67108864n;
        break;
      case 9:
        result = 1n;
        break;
      case 10:
        result = 256n;
        break;
      case 11:
        result = 16n;
        break;
      case 12:
        result = 536870912n;
        break;
      case 13:
        result = 1024n;
        break;
      case 14:
        result = 2048n;
        break;
      case 15:
        result = 4096n;
        break;
      case 16:
        result = 8192n;
        break;
      case 17:
        result = 16384n;
        break;
      case 18:
        result = 32768n;
        break;
      case 19:
        result = 65536n;
        break;
      case 20:
        result = 131072n;
        break;
      case 21:
        result = 262144n;
        break;
      case 22:
        result = 64n;
        break;
      case 23:
        result = 1048576n;
        break;
      case 24:
        result = 2097152n;
        break;
      case 25:
        result = 4194304n;
        break;
      case 26:
        result = 8388608n;
        break;
      case 27:
        result = 16777216n;
        break;
      case 28:
        result = 33554432n;
        break;
      case 29:
        result = 1099511627775n;
        break;
      case 30:
        result = 200n;
        break;
      default:
        break;
    }

    if (role?.id) {
      const perms = role.permissions;
      if (Array.isArray(role)) {
        this.callListFunc(role, 'setPermissions', [role.id, options]).then(() => this.callNextAction(cache));
      }
      if (data.state === '0') {
        role
          .setPermissions([perms, result], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      } else {
        role
          .setPermissions([perms - result], reason)
          .then(() => this.callNextAction(cache))
          .catch(this.displayError.bind(this, data, cache));
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};
