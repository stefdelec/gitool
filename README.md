# gitool

Gitool helps you always have the right format for your commit message.
Following https://www.conventionalcommits.org/en/v1.0.0-beta.2/

## check commit format

For last one:
```gitool --checkCommit```

For last 3
```gitool --checkCommit --last=3```
or ```gitool -c -l=3```
or ```gitool -cl=3```


## pretty print

```gitool --prettyPrint```
```gitool -p```


## message composer

```gitool --messageComposer --test``` to test the functionality
or ```gitool -mt```

and
```gitool --messageComposer``` to make a real commit
```gitool --m``` to make a real commit


