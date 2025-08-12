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
const nanoid_1 = require("nanoid");
const _1 = require(".");
// import * as benchmark from "benchmark";
// const suite = new benchmark.Suite();
class Attribute extends _1.Schema {
}
__decorate([
    (0, _1.type)("string"),
    __metadata("design:type", String)
], Attribute.prototype, "name", void 0);
__decorate([
    (0, _1.type)("number"),
    __metadata("design:type", Number)
], Attribute.prototype, "value", void 0);
class Item extends _1.Schema {
    constructor() {
        super(...arguments);
        this.attributes = new _1.ArraySchema();
    }
}
__decorate([
    (0, _1.type)("number"),
    __metadata("design:type", Number)
], Item.prototype, "price", void 0);
__decorate([
    (0, _1.type)([Attribute]),
    __metadata("design:type", Object)
], Item.prototype, "attributes", void 0);
class Position extends _1.Schema {
}
__decorate([
    (0, _1.type)("number"),
    __metadata("design:type", Number)
], Position.prototype, "x", void 0);
__decorate([
    (0, _1.type)("number"),
    __metadata("design:type", Number)
], Position.prototype, "y", void 0);
class Player extends _1.Schema {
    constructor() {
        super(...arguments);
        this.position = new Position();
        this.items = new _1.MapSchema();
    }
}
__decorate([
    (0, _1.type)(Position),
    __metadata("design:type", Object)
], Player.prototype, "position", void 0);
__decorate([
    (0, _1.type)({ map: Item }),
    __metadata("design:type", Object)
], Player.prototype, "items", void 0);
class State extends _1.Schema {
    constructor() {
        super(...arguments);
        this.players = new _1.MapSchema();
    }
}
__decorate([
    (0, _1.type)({ map: Player }),
    __metadata("design:type", Object)
], State.prototype, "players", void 0);
__decorate([
    (0, _1.type)("string"),
    __metadata("design:type", Object)
], State.prototype, "currentTurn", void 0);
const state = new State();
let now = Date.now();
// for (let i = 0; i < 10000; i++) {
//     const player = new Player();
//     state.players.set(`p-${nanoid()}`, player);
//
//     player.position.x = (i + 1) * 100;
//     player.position.y = (i + 1) * 100;
//     for (let j = 0; j < 10; j++) {
//         const item = new Item();
//         item.price = (i + 1) * 50;
//         for (let k = 0; k < 5; k++) {
//             const attr = new Attribute();
//             attr.name = `Attribute ${k}`;
//             attr.value = k;
//             item.attributes.push(attr);
//
//         }
//         player.items.set(`item-${j}`, item);
//     }
// }
// console.log("time to make changes:", Date.now() - now);
//
// process.exit();
// measure time to .encodeAll()
now = Date.now();
for (let i = 0; i < 1000; i++) {
    state.encodeAll();
}
console.log(Date.now() - now);
let avgTimeToEncode = 0;
let avgTimeToMakeChanges = 0;
const total = 100;
const allEncodes = Date.now();
for (let i = 0; i < total; i++) {
    now = Date.now();
    for (let j = 0; j < 50; j++) {
        const player = new Player();
        state.players.set(`p-${(0, nanoid_1.nanoid)()}`, player);
        player.position.x = (j + 1) * 100;
        player.position.y = (j + 1) * 100;
        for (let k = 0; k < 10; k++) {
            const item = new Item();
            item.price = (j + 1) * 50;
            for (let l = 0; l < 5; l++) {
                const attr = new Attribute();
                attr.name = `Attribute ${l}`;
                attr.value = l;
                item.attributes.push(attr);
            }
            player.items.set(`item-${k}`, item);
        }
    }
    const timeToMakeChanges = Date.now() - now;
    console.log("time to make changes:", timeToMakeChanges);
    avgTimeToMakeChanges += timeToMakeChanges;
    now = Date.now();
    state.encode();
    const timeToEncode = Date.now() - now;
    console.log("time to encode:", timeToEncode);
    avgTimeToEncode += timeToEncode;
}
console.log("avg time to encode:", (avgTimeToEncode) / total);
console.log("avg time to make changes:", (avgTimeToMakeChanges) / total);
console.log("time for all encodes:", Date.now() - allEncodes);
console.log(Array.from(state.encodeAll()).length, "bytes");
//# sourceMappingURL=bench_encode.js.map