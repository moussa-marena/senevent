const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Surveiller seulement le package partagé et les node_modules racine
config.watchFolders = [
    path.join(monorepoRoot, "packages"),
    path.join(monorepoRoot, "node_modules"),
];

config.resolver.nodeModulesPaths = [
    path.join(projectRoot, "node_modules"),
    path.join(monorepoRoot, "node_modules"),
];

// Forcer UNE seule copie de React et React DOM : tout import "react" ou
// "react-dom" (même depuis un autre paquet) est résolu depuis apps/mobile.
const uniques = ["react", "react-dom"];

config.resolver.resolveRequest = (context, moduleName, platform) => {
    const estUnique = uniques.some(
        (nom) => moduleName === nom || moduleName.startsWith(nom + "/")
    );
    if (estUnique) {
        return context.resolveRequest(
            { ...context, originModulePath: path.join(projectRoot, "package.json") },
            moduleName,
            platform
        );
    }
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;