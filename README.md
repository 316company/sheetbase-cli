# Sheetbase CLI

Official CLI for working with Sheetbase.

## Install

``npm install -g sheetbase-cli``

## Usage

### login

Grant access to your Google account.

``$ sheetbase login``

### logout

Stop granting access to your Google account.

``$ sheetbase logout``

### whoami

Output your account info.

``$ sheetbase whoami``

### start

Create new project.

``$ sheetbase start <dirName> [options]``

Params:

**dirName**: Project name, ex. ``myProject``, ``project1``, ...

Options:

**--theme**|**-t** [theme]: Official theme name or .git url.

**--remote**|**-r** [remote]: Your project remote repo .git url.

### mine

Ouput project usefull resources.

``$ sheetbase mine [options]``

Options:

**--open**|**-o** [configKey]: Open link in the browser.

### config

Set config for the project.

``$ sheetbase config <data>``

Params:

**data**: Config data in format of key=value, ex. ``apiKey=my_api_key``, ``database=my_database``

### help

Show helps.

``$ sheetbase help``

## Examples

```bash
$ sheetbase -v

$ sheetbase login
$ sheetbase whoami

$ sheetbase start myProject
$ sheetbase start "my project" -t ionic-simpleblog
$ sheetbase start myProject -r https://github.com/<username>/<my_repo>.git

$ sheetbase mine -o # open the project Drive folder in browser

$ sheetbase config "apiKey=my_api_key|database=my_database" # multiple values

```

## Support us
[<img src="https://cloakandmeeple.files.wordpress.com/2017/06/become_a_patron_button3x.png?w=200">](https://www.patreon.com/lamnhan)