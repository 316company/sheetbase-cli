# Sheetbase CLI

Official CLI for working with Sheetbase.

## Install

``npm install -g sheetbase-cli``

## Usage

### start

``sheetbase start <dirName> [options]``

Options:

**--theme** | **-t**: Theme name or .git url.

**--remote** | **-r**: Your project remote repo.

## Examples

```bash
$ sheetbase -v

$ sheetbase start myProject

$ sheetbase start myProject -t ion-simpleblog

$ sheetbase start myProject -r https://github.com/316Company/my-project.git

```