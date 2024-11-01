#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);

let flavour = '';
let variant = '';

function capitalizeFirstLetter(str) {
  if (str.length === 0) return str; // Return empty string if input is empty
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

for (let i = 0; i < args.length; i++) {
  if (args[i] === '-f' || args[i] === '--flavour') {
    flavour = capitalizeFirstLetter(args[i + 1]);
    i++;
  } else if (args[i] === '-v' || args[i] === '--variant') {
    variant = capitalizeFirstLetter(args[i + 1]);
    i++;
  }
}

let isPatchPackageInstalled = false;

const checkAndInstallPatchPackage = () => {
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const hasPatchPackage = fs.existsSync(
    path.join(nodeModulesPath, 'patch-package')
  );

  if (!hasPatchPackage) {
    console.log('patch-package is not installed. Installing...');

    if (!fs.existsSync(packageJsonPath)) {
      console.error('package.json not found. Are you in a Node.js project?');
      return false;
    }

    try {
      execSync('yarn add patch-package', { stdio: 'inherit' });
      console.log('patch-package has been installed.');
      return true;
    } catch (error) {
      console.error('Error installing patch-package:', error);
      return false;
    }
  } else {
    isPatchPackageInstalled = true;
    console.log('patch-package is already installed.');
    return true;
  }
};

const moveReactNativePatch = () => {
  const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
  const patchLocation = path.resolve(
    nodeModulesPath,
    '@sarthak-d11/de-frost/src/patches_to_ship/react-native+0.72.5.patch'
  );
  const mainPatchLocation = path.resolve(process.cwd(), 'patches');

  if (!fs.existsSync(mainPatchLocation)) {
    execSync('mkdir patches');
  }

  execSync(`cp ${patchLocation} ${mainPatchLocation}`);
};

const createBuild = () => {
  const androidBuild = path.resolve(
    process.cwd(),
    'android/app/build/outputs/apk/release/app-release.apk'
  );
  const envVariable = `export DEFROST_ENABLE=true`;

  execSync('yarn', { stdio: 'inherit' });
  execSync(
    `cd android && ${envVariable} && ./gradlew app:assemble${flavour}${variant}Release && cd ..`,
    { stdio: 'inherit' }
  );

  try {
    execSync('mkdir ff_apks');
  } catch (ex) {
    console.log('ff_apks already exists');
  }

  execSync(`cp ${androidBuild} ff_apks`);
};

const cleanUp = () => {
  const envVariable = `export DEFROST_ENABLE=false`;

  if (!isPatchPackageInstalled) {
    try {
      execSync('yarn remove patch-package', { stdio: 'inherit' });
      execSync('rm -rf patches');
    } catch (error) {}
  } else {
    execSync('rm -rf patches/react-native+0.72.5.patch');
  }

  execSync(envVariable);
};

try {
  console.log(
    '-----------------Checking and Installing PatchPackage: Start -------------'
  );
  checkAndInstallPatchPackage();
  console.log(
    '-----------------Checking and Installing PatchPackage: Done -------------'
  );
  console.log('-----------------Applying RN Patch: Start -------------');
  moveReactNativePatch();
  console.log('-----------------Applying RN Patch: Done -------------');
  console.log('-----------------Creating the build: Start -------------');
  createBuild();
  console.log('-----------------Creating the build: Done -------------');
} catch (ex) {}

cleanUp();
