# Instructions

## Include JaCoCo in the project

- 1: In gradle project file -build.gradle(AndroidProjectName)-, add the stable JaCoCo version. At the time writing is the following:


```
buildscript {
    ext.kotlin_version = "1.4.32"
    ext.jacocoVersion = "0.8.4"
    repositories {
        google()
        jcenter()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:4.1.3"
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        // JaCoCo
        classpath "org.jacoco:org.jacoco.core:$jacocoVersion"
	// Other dependencies ...
    }
}
```

- 2: Now, we must add the task and some extra configuration in order to make gradle produce the JaCoCo reports. Inside the gradle app file -build.gradle(Module)-. These reports will be created locally, (the default .gitignore will prevent from staging them). 
In `plugins`, add the following `id 'jacoco'`.
Then, we create the gradle task:

```
task jacocoCoverageReport(type: JacocoReport, dependsOn: ['testDebugUnitTest', 'createDebugCoverageReport']) {
    reports {
        xml.enabled = true
        html.enabled = true
        def fileFilter = ['**/R.class', '**/R$*.class', '**/BuildConfig.*', '**/Manifest*.*', '**/*Test*.*', 'android/**/*.*']
        def debugTree = fileTree(dir: "${buildDir}/intermediates/classes/debug", excludes: fileFilter)
        def mainSrc = "${project.projectDir}/src/main/java"
        sourceDirectories.setFrom(files([mainSrc]))
        classDirectories.setFrom(files([debugTree]))
        executionData.setFrom(fileTree(dir: "$buildDir", includes: [
                "jacoco/testDebugUnitTest.exec",
                "outputs/code-coverage/connected/coverage.ec"
        ]))
    }
}

tasks.withType(Test) {
    jacoco.includeNoLocationClasses = true
    jacoco.excludes = ['jdk.internal.*']
}
```

Last, inside android configurations object, add these properties:

Inside buildTypes, debug should have testCoverageEnabled

```
buildTypes {
        // other props
        debug {
            testCoverageEnabled true
        }
}
```

and testOptions should ignore generated classes, so it would have to be like this 

```
testOptions {
        unitTests.all {
            jacoco {
                includeNoLocationClasses = true
            }
        }
        unitTests.returnDefaultValues = true
    }
```

- 3: By now, Android Studio should be suggesting to sync the new gradle files. Sync them, and now we're ready to execute the JaCoCo reports directly from Android Studio, or from the root folder running the following command:
```
./gradlew jacocoCoverageReport 
```

## Include pre-commit script:

Git allow us to run scripts when commiting or pushing. If you want to include the *pre-commit* **git-hook**, go to the hidden *.git* folder, located at the root of the repository. Once there, go to `hooks` folder, and overwrite the default *pre-commit* hook with the one in this repo.  
Then, since JaCoCo generates html files, the pre-commit hook calls an script that reads the code-coverage file, takes the coverage percentage, and writes it into a json file. In order to work, the pre-commit searchs that script in the Android Studio root directory. The script name is *jacocoparser*.

# Troubleshooting

- A common error that may show is the next one. The cause is that we have multiple JVM's and gradle selects a different JVM when calling it from a script. 
```
> Kotlin could not find the required JDK tools in the Java installation '/Library/Internet Plug-Ins/JavaAppletPlugin.plugin/Contents/Home' used by Gradle. Make sure Gradle is running on a JDK, not JRE.
```

To fix it, go to gradle.properties file, and add the following line at the end.

```
org.gradle.java.home=/Users/'YOUR USER'/Library/Java/JavaVirtualMachines/'YOUR JAVA VERSION'/Contents/Home
```
