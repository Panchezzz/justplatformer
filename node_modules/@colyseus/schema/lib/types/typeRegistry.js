"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerType = registerType;
exports.getType = getType;
const registeredTypes = {};
function registerType(identifier, definition) {
    registeredTypes[identifier] = definition;
}
function getType(identifier) {
    return registeredTypes[identifier];
}
//# sourceMappingURL=typeRegistry.js.map