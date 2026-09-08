import JSZip from 'jszip';
import { kotlinFiles } from '../data/kotlinCode';

export async function downloadAndroidProjectZip(): Promise<void> {
  const zip = new JSZip();

  // 1. Root configuration files (Native Android Kotlin DSL)
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "NSElectrical"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `plugins {
    id("com.android.application") version "8.2.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.22" apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  // Gradle wrapper
  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`
  );

  // Gradle scripts for Windows and Linux/Mac
  zip.file(
    'gradlew.bat',
    `@rem
@rem Copyright 2015 the original author or authors.
@rem
@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve Java home
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto execute

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
goto fail

:execute
@rem Execute Gradle
"%JAVA_EXE%" -Dorg.gradle.appname=%APP_BASE_NAME% -classpath "%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain %*

:fail
exit /b 1
`
  );

  // Android Resource files
  zip.file(
    'app/src/main/res/values/strings.xml',
    `<resources>
    <string name="app_name">NS Electrical</string>
    <string name="surveyor_name">Nirmalya Sarkar</string>
    <string name="official_email">bishnusarkar4321@gmail.com</string>
</resources>
`
  );

  zip.file(
    'app/src/main/res/values/colors.xml',
    `<resources>
    <color name="primary_electric">#38BDF8</color>
    <color name="primary_dark">#0F172A</color>
    <color name="accent_teal">#06B6D4</color>
    <color name="status_green">#10B981</color>
</resources>
`
  );

  // Add all Kotlin files into their respective directories
  kotlinFiles.forEach((file) => {
    zip.file(file.path, file.code);
  });

  // Comprehensive README.md with clear instructions for Android Studio & USB Debugging
  zip.file(
    'README.md',
    `# NS Electrical - Native Android App (Kotlin & Jetpack Compose)
Surveyor & Engineer: **Nirmalya Sarkar**  
Official Contact: \`bishnusarkar4321@gmail.com\`  
Technology: **100% Pure Native Kotlin (Jetpack Compose & Material 3)**  

---

## How to Install on Your Android Phone using Android Studio (USB):

### Step 1: Open in Android Studio
1. Open **Android Studio**.
2. Click **Open** (or \`File > Open...\`).
3. Select this folder and click **OK**.
4. Android Studio will automatically recognize the native Gradle project and sync dependencies.

### Step 2: Connect Phone via USB
1. Plug your Android phone into your computer with a USB cable.
2. Ensure **USB Debugging** is turned ON in your phone's Developer Options.
3. Tap **"Allow USB Debugging"** on your phone screen.

### Step 3: Run & Install with 1 Click!
1. In Android Studio's top toolbar, choose your connected phone from the device dropdown.
2. Click the green **Run (Play ▶)** button (or press \`Shift + F10\`).
3. Android Studio compiles the native Kotlin app and installs it directly onto your phone!

---

### Step 4 (Optional): Command-Line Install in PowerShell / Terminal
Open your terminal in this folder and run:
\`\`\`powershell
.\\gradlew.bat installDebug
\`\`\`
This directly pushes and installs the app onto your USB-connected Android device!
`
  );

  // Generate and trigger download safely
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'ns_electrical_native_android_kotlin_project.zip');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    try {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // ignore
    }
  }, 60000);
}
