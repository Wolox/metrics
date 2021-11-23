# Instructions

## Include project info in the test script

- 1: In the root directory of the project, add the script. 

- 2: Now, we must add some extra information in order to make the reports. Inside the script we have

```
PROJECT_DIR="path/to/folder"
XCODE_PROJECT="file.xcworkspace"
SCHEME="yourScheme"
```

Where:
 - PROJECT_DIR: we must add the folder where we have the .xcworkspace.
 - XCODE_PROJECT: we must add the name of the .xcworkspace.
 - SCHEME: we must add the scheme where we will run the tests.


## Include pre-commit script:

Git allow us to run scripts when commiting or pushing. If you want to include the *pre-commit* **git-hook**, go to the hidden *.git* folder, located at the root of the repository. Once there, go to `hooks` folder, and overwrite the default *pre-commit* hook with the one in this repo.  
Then, the pre-commit hook calls an script that reads the code-coverage file, takes the coverage percentage, and writes it into a json file. In order to work, the pre-commit searchs that script in the project root directory. The script name is *test*.

## Troubleshooting

. A common error that may show is the next one.
```
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory 'Library/Developer/CommarndLineTools' is a command line tools instance
```

To solve this, run the next line on terminal.
```
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

