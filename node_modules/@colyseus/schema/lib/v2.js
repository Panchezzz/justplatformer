"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
// globalThis.interval = setInterval(() => {}, 1000);
// class Item extends Schema {
//     @type("string") name: string;
// }
// class RootState extends Schema {
//     @type([Item]) items = new ArraySchema<Item>();
// }
// const state = new RootState();
// state.items.push(new Item().assign({ name: "hello" }));
// console.log("Encoded:", state.encode());
class Vec3 extends index_1.Schema {
}
__decorate([
    (0, index_1.type)("number"),
    __metadata("design:type", Number)
], Vec3.prototype, "x", void 0);
__decorate([
    (0, index_1.type)("number"),
    __metadata("design:type", Number)
], Vec3.prototype, "y", void 0);
__decorate([
    (0, index_1.type)("number"),
    __metadata("design:type", Number)
], Vec3.prototype, "z", void 0);
class Base extends index_1.Schema {
}
class Entity extends index_1.Schema {
    constructor() {
        super(...arguments);
        this.position = new Vec3().assign({ x: 0, y: 0, z: 0 });
    }
}
__decorate([
    (0, index_1.type)(Vec3),
    __metadata("design:type", Object)
], Entity.prototype, "position", void 0);
class Player extends Entity {
    constructor() {
        super(...arguments);
        this.rotation = new Vec3().assign({ x: 0, y: 0, z: 0 });
        this.secret = "private info only for this player";
    }
}
__decorate([
    (0, index_1.type)(Vec3),
    __metadata("design:type", Object)
], Player.prototype, "rotation", void 0);
__decorate([
    (0, index_1.type)("string"),
    __metadata("design:type", String)
], Player.prototype, "secret", void 0);
class State extends index_1.Schema {
    constructor() {
        super(...arguments);
        // @type({ map: Base }) players = new MapSchema<Entity>();
        this.num = 0;
        this.str = "Hello world!";
        // @type(Entity) entity = new Player().assign({
        //     position: new Vec3().assign({ x: 1, y: 2, z: 3 }),
        //     rotation: new Vec3().assign({ x: 4, y: 5, z: 6 }),
        // });
        this.entities = new index_1.MapSchema();
    }
}
__decorate([
    (0, index_1.type)("number"),
    __metadata("design:type", Number)
], State.prototype, "num", void 0);
__decorate([
    (0, index_1.type)("string"),
    __metadata("design:type", Object)
], State.prototype, "str", void 0);
__decorate([
    (0, index_1.type)({ map: Entity }),
    __metadata("design:type", Object)
], State.prototype, "entities", void 0);
const state = new State();
state.entities.set("one", new Player().assign({
    position: new Vec3().assign({ x: 1, y: 2, z: 3 }),
    rotation: new Vec3().assign({ x: 1, y: 2, z: 3 }),
}));
state.entities.set("two", new Player().assign({
    position: new Vec3().assign({ x: 4, y: 5, z: 6 }),
    rotation: new Vec3().assign({ x: 7, y: 8, z: 9 }),
}));
let encoded = state.encode();
console.log(`(${encoded.length})`, encoded);
globalThis.perform = function () {
    for (let i = 0; i < 500000; i++) {
        state.encodeAll();
    }
};
function logTime(label, callback) {
    const time = Date.now();
    for (let i = 0; i < 500000; i++) {
        callback();
    }
    console.log(`${label}:`, Date.now() - time);
}
logTime("encode time", () => state.encodeAll());
// const decoded = new State();
// logTime("decode time", () => decoded.decode(encoded));
// const time = Date.now();
// console.profile();
// for (let i = 0; i < 300000; i++) {
//   state.encodeAll();
// }
// console.profileEnd();
// console.log("encode time:", Date.now() - time);
// const decoded = Reflection.decode(Reflection.encode(state));
// decoded.decode(encoded);
//
// console.log(decoded.toJSON());
//
// const rotation = state.entity.rotation;
// rotation.x = 100;
//
// encoded = state.encode();
// console.log({encoded});
//
// decoded.decode(encoded);
// console.log(decoded.toJSON());
// const time = Date.now();
// for (let i = 0; i < 300000; i++) {
//   const state = new State();
//   state.encode();
// }
// console.log("encode time:", Date.now() - time);
//# sourceMappingURL=v2.js.map