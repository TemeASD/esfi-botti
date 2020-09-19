# esfi-botti


[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

Bot for organizing games on Discord. Not fancy at all.

---

## Installation

- Create a config.json. Should look like this: 

```json
{
    "token": "TOKEN_FROM_DISCORD",
    "prefix": "prefix_of_your_choice"
}
```

### Dependencies

- Node.js v12+
- npm

### Setup


> update and install this package first

```shell
$ npm install
```

### Run

```shell
$ node bot.js
```

---

## Features

### Scrims

You need
* Linux server
* CSGO server software
* Sourcemod and metamod
* get5

Create `server.cfg` on the cfg folder of your CSGO server

```ascii
sv_timeout 60
mp_autoteambalance 1
writeid
writeip
sv_maxrate 0
sv_minrate 80000
sv_maxcmdrate 128
sv_mincmdrate 128
sv_minupdaterate 128
sv_maxupdaterate 128
tv_enable 1
get5_scrim
exec autoexec.cfg
```

Create `autoexec.cfg` on the cfg folder and fill in these

```ascii
log on
hostname "HOSTNAME"
rcon_password "RCON_PW"
sv_password "SERVER_PW"
sv_cheats 0
sv_pure -1
sv_lan 0
```

## Collaborating

Shoot a pull request and I'll most likely merge it.

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2020 © <a href="temeasd.github.io" target="_blank">TemeASD</a>.
