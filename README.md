[![Build Status](https://travis-ci.org/stefdelec/gitool.svg?branch=master)](https://travis-ci.org/stefdelec/gitool)
[![npm version](https://img.shields.io/npm/v/gitool.svg?style=flat)](https://www.npmjs.com/package/gitool)

# gitool

Gitool helps you always have the right format for your commit message.
Following https://www.conventionalcommits.org/en/v1.0.0-beta.2/

## alias
any gitool command can be called with ```gitool``` or ```gt```

## check commit format

For last one:
```gitool --checkCommit```

For last 3
```gitool --checkCommit --last=3```
or ```gitool -c -l=3```
or ```gitool -cl=3```


![alt text](https://raw.githubusercontent.com/stefdelec/gitool/master/readme/commitchecker.png)

## pretty print

```gitool --prettyPrint```
```gitool -p``` (groupBy type by default)

```gitool -p groupBy='type'```

```gitool -pg='type'```
```gitool -pg='scope'```

![alt text](https://raw.githubusercontent.com/stefdelec/gitool/master/readme/commitprettier.png)


Output a file:

```gitool -po=releaseNote.md'```

```gitool -p --output=releaseNote.md'```
[example of this repo here](../releasenote.md)

## message composer

```gitool --messageComposer --test``` to test the functionality
or ```gitool -mt```

and
```gitool --messageComposer``` to make a real commit
```gitool --m``` to make a real commit


![alt text](https://raw.githubusercontent.com/stefdelec/gitool/master/readme/messagecomposer.png)
