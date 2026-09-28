// Metro config for the example app. It consumes the library straight from `../src`,
// so edits to the module hot-reload without a build step.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

const escape = (p) => p.replace(/[/\\]/g, '[/\\\\]');

// The library's devDependencies (react, react-native, lottie-react-native, expo…) live in
// ../node_modules. Block them so the app only ever loads a single copy from ./node_modules.
const blockedPackages = ['react', 'react-dom', 'react-native', 'lottie-react-native', 'expo', '@expo'];
config.resolver.blockList = [
  ...Array.from(config.resolver.blockList ?? []),
  ...blockedPackages.map(
    (name) => new RegExp(escape(path.join(root, 'node_modules', name)) + '[/\\\\].*')
  ),
];

config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(root, 'node_modules'),
];

config.watchFolders = [root];

const defaultResolve = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'expo-useanimations' || moduleName.startsWith('expo-useanimations/')) {
    const sub = moduleName.slice('expo-useanimations'.length); // '' | '/all' | '/lib/heart'
    const target = path.join(root, 'src', sub || 'index');
    return context.resolveRequest(context, target, platform);
  }
  return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
