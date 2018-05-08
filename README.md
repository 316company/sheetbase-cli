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

**--noNpmInstall**|**-x**: Do not install packages.

**--noGit**|**-u**: Do not setup GIT.

### setup

Setup a project.

``$ sheetbase setup [options]``

Options:

**--noNpmInstall**|**-x**: Do not install packages.

**--noGit**|**-u**: Do not setup GIT.

### url

Ouput project usefull links.

``$ sheetbase url [options]``

Options:

**--open**|**-o** [urlKey]: Open link in the browser.

### config

Get/set config for the project.

``$ sheetbase config <action> [options]``

Params:

**action**: Sub action, can be *get* or *set*.

Options:

**--manual**|**-m** [data]: For *set* action only, manual config data in format of key=value, ex. ``apiKey=my_api_key``, ``database=my_database``

### help

Show helps.

``$ sheetbase help``

## Examples

```bash
$ sheetbase -v
$ sheetbase help

$ sheetbase login
$ sheetbase whoami

$ sheetbase start myProject
$ sheetbase start myProject -t ionic-simpleblog
$ sheetbase start myProject -t https://<git_url_to_a_sheetbase_theme>.git

$ sheetbase setup # run inside a sheetbase project

$ sheetbase url -o # open the project Drive folder in browser

$ sheetbase config get
$ sheetbase config set
$ sheetbase config set -m "apiKey=my_api_key|database=my_database" # multiple values

```

## Support us
[<img src="https://cloakandmeeple.files.wordpress.com/2017/06/become_a_patron_button3x.png?w=200">](https://www.patreon.com/lamnhan)