const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Racine du projet mobile et racine du Monorepo
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// 1. Surveiller tout le monorepo (pour voir packages/shared)
config.watchFolders = [monorepoRoot];

// 2. Chercher les modules dans les deux node_modules
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(monorepoRoot, "node_modules"),
];

// 3. Forcer la déduplication de React et React Native pour éviter les doublons dans le Monorepo
config.resolver.extraNodeModules = {
    react: path.resolve(projectRoot, "node_modules/react"),
    "react-native": path.resolve(projectRoot, "node_modules/react-native"),
};

module.exports = config;