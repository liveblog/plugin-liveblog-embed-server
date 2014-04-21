# Plugin for superdesk liveblog embed
[![Build Status](https://travis-ci.org/liveblog/plugin-liveblog-embed-server.png?branch=master)](https://travis-ci.org/liveblog/plugin-liveblog-embed-server)

Liveblog embed server side generation plugin for superdesk. Made with backbone.

*License*: [GPLv3](http://www.gnu.org/licenses/gpl-3.0.txt)

*Copyright*: [Sourcefabric o.p.s.](http://www.sourcefabric.org)

## Setup

Client requires `nodejs` installed and a few steps:
```
npm install -g grunt-cli # install grunt
npm install # install other node dependencies
bower install # install bower components
```
After you can start local dev server on port `9000`:
```
grunt server
```
## Documentation

Documentation can be generated with two options:

With [docco](http://jashkenas.github.io/docco/), this doesn't provide an index.html file for docs folder nor a structure.
Docco is the most used documentation server and it is up-to-date from official repo.

a) grunt docco:all # for script files
   grunt docco:test # for test files

With [docco husky](https://github.com/mbrevoort/docco-husky), this provides an index.html with stats.
Docco husky isn't keep up to date at this point 2years passed and no commits where done.
Now is running a fork from `nistormihai` repo witch is keeped up to date by author.

b) grunt docco-husky:all 

## Info for contributors

### Commit messages

Every commit has to have a meaningful commit message in form:

```
[JIRA ref] [JIRA Title] or [Tile]
<empty line>
[Description]
```
### Pull requests
Every pull request has to have a meaningful message if not specified from commit,
 then it needs a good description of what is does.



Where [JIRA ref](https://confluence.atlassian.com/display/FISHEYE/Using+smart+commits) is at least Issue code eg. ```LB-13```.

For trivial changes you can ommit JIRA ref or Description or both: ```Add travis.yml files```

### CI

You can test your code before sending a PR via: ```./travis_build.sh```
