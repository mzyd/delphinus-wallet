"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.main = exports.deposit = void 0;
var keyring_1 = require("@polkadot/keyring");
var bn_js_1 = require("bn.js");
var util_crypto_1 = require("@polkadot/util-crypto");
var utils_1 = require("../libs/utils");
var ss58 = require("substrate-ss58");
function getSudo() {
    return __awaiter(this, void 0, void 0, function () {
        var keyring;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 1:
                    _a.sent();
                    keyring = new keyring_1["default"]({ type: "sr25519" });
                    return [2 /*return*/, keyring.addFromUri("//Alice", { name: "Alice default" })];
            }
        });
    });
}
function deposit(accountAddress, chainId, token) {
    return __awaiter(this, void 0, void 0, function () {
        var api, sudo, sudoAddress, nonce, _a, accountId, l2nonce, tx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, utils_1.getAPI()];
                case 1:
                    api = _b.sent();
                    return [4 /*yield*/, getSudo()];
                case 2:
                    sudo = _b.sent();
                    sudoAddress = sudo.address;
                    _a = bn_js_1["default"].bind;
                    return [4 /*yield*/, api.query.system.account(sudoAddress)];
                case 3:
                    nonce = new (_a.apply(bn_js_1["default"], [void 0, (_b.sent()).nonce]))();
                    accountId = ss58.addressToAddressId(sudoAddress);
                    return [4 /*yield*/, api.query.swapModule.nonceMap(accountId)];
                case 4:
                    l2nonce = _b.sent();
                    tx = api.tx.swapModule.deposit(accountAddress, utils_1.compressToken(chainId, token), 100, l2nonce);
                    tx.signAndSend(sudo, { nonce: nonce });
                    return [2 /*return*/];
            }
        });
    });
}
exports.deposit = deposit;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, deposit("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "15", "33034FD0b1640C928D2Cf21969b89e4dDd3aEDbF")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, deposit("5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", "16", "8BB852f1Ee7B2a8Ce79876BdEbE713124CD186Ea")];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
main();
