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
exports.retrieve = exports.supply = exports.swap = exports.withdraw = exports.queryPoolShareAsync = exports.queryPoolAmountAsync = exports.queryTokenAmountAsync = exports.getAPI = exports.getAddressOfAccoutAsync = void 0;
var api_1 = require("@polkadot/api");
var api_2 = require("@polkadot/api");
var util_crypto_1 = require("@polkadot/util-crypto");
var substrate_node_json_1 = require("./substrate-node.json");
var types_json_1 = require("./types.json");
var utils_l1_1 = require("./utils-l1");
var BN = require("bn.js");
var ss58 = require("substrate-ss58");
var keyring = new api_2.Keyring({ type: "sr25519" });
function getAddressOfAccoutAsync(account, callback) {
    util_crypto_1.cryptoWaitReady().then(function () {
        return callback(account, keyring.addFromUri("//" + account).address);
    });
}
exports.getAddressOfAccoutAsync = getAddressOfAccoutAsync;
var api;
function getAPI() {
    return __awaiter(this, void 0, void 0, function () {
        var provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!(api === null || api === void 0 ? void 0 : api.isConnected)) return [3 /*break*/, 2];
                    provider = new api_1.WsProvider(substrate_node_json_1["default"].host + ":" + substrate_node_json_1["default"].port);
                    return [4 /*yield*/, api_1.ApiPromise.create({ provider: provider, types: types_json_1["default"] })];
                case 1:
                    api = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, api];
            }
        });
    });
}
exports.getAPI = getAPI;
function queryTokenAmountAsync(accountAddress, chainId, tokenAddress, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = function () { return __awaiter(_this, void 0, void 0, function () {
                        var api, accountId, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getAPI()];
                                case 1:
                                    api = _a.sent();
                                    accountId = ss58.addressToAddressId(accountAddress);
                                    return [4 /*yield*/, api.query.swapModule.balanceMap(accountId + compressToken(chainId, tokenAddress, true))];
                                case 2:
                                    result = _a.sent();
                                    callback(result.toString());
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    callback("failed:" + tokenAddress + "[" + chainId + "]");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.queryTokenAmountAsync = queryTokenAmountAsync;
function queryPoolAmountAsync(chainId1, tokenAddress1, chainId2, tokenAddress2, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, e_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = function () { return __awaiter(_this, void 0, void 0, function () {
                        var api, result, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getAPI()];
                                case 1:
                                    api = _a.sent();
                                    if (!(compressToken(chainId1, tokenAddress1) < compressToken(chainId2, tokenAddress2))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, api.query.swapModule.poolMap("0x" +
                                            compressToken(chainId1, tokenAddress1, true) +
                                            compressToken(chainId2, tokenAddress2, true))];
                                case 2:
                                    result = _a.sent();
                                    callback(result.toString());
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, api.query.swapModule.poolMap("0x" +
                                        compressToken(chainId2, tokenAddress2, true) +
                                        compressToken(chainId1, tokenAddress1, true))];
                                case 4:
                                    result = _a.sent();
                                    callback(result.toString());
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    callback("failed");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.queryPoolAmountAsync = queryPoolAmountAsync;
function queryPoolShareAsync(accountAddress, chainId1, tokenAddress1, chainId2, tokenAddress2, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var fn, e_3;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fn = function () { return __awaiter(_this, void 0, void 0, function () {
                        var api, accountId, result, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getAPI()];
                                case 1:
                                    api = _a.sent();
                                    accountId = ss58.addressToAddressId(accountAddress);
                                    if (!(compressToken(chainId1, tokenAddress1) < compressToken(chainId2, tokenAddress2))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, api.query.swapModule.shareMap(accountId +
                                            compressToken(chainId1, tokenAddress1, true) +
                                            compressToken(chainId2, tokenAddress2, true))];
                                case 2:
                                    result = _a.sent();
                                    callback(result.toString());
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, api.query.swapModule.shareMap(accountId +
                                        compressToken(chainId2, tokenAddress2, true) +
                                        compressToken(chainId1, tokenAddress1, true))];
                                case 4:
                                    result = _a.sent();
                                    callback(result.toString());
                                    _a.label = 5;
                                case 5: return [2 /*return*/];
                            }
                        });
                    }); };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    callback("failed");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.queryPoolShareAsync = queryPoolShareAsync;
/*
async function getSudo() {
  await cryptoWaitReady();
  const keyring = new Keyring({ type: "sr25519" });
  return keyring.addFromUri("//Alice", { name: "Alice default" });
}

export async function deposit(
  accountAddress: string,
  chainId: string,
  token: string
) {
  const api = await getAPI();
  const sudo = await getSudo();
  const sudoAddress = (sudo as any).address;
  const nonce = new BN(
    (await api.query.system.account(sudoAddress)).nonce
  );
  const accountId = ss58.addressToAddressId(sudoAddress);
  const l2nonce = await api.query.swapModule.nonceMap(accountId);
  const tx = api.tx.swapModule.deposit(
    accountAddress,
    compressToken(chainId, token),
    100,
    l2nonce
  );
  tx.signAndSend(sudo, { nonce });
}
*/
function withdraw(account, chainId, token, amount, progress, error) {
    return __awaiter(this, void 0, void 0, function () {
        var api_3, keyring_1, signer, nonce, _a, accountId, l2nonce, l1account, tx, ret, e_4, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, getAPI()];
                case 1:
                    api_3 = _c.sent();
                    return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 2:
                    _c.sent();
                    keyring_1 = new api_2.Keyring({ type: "sr25519" });
                    signer = keyring_1.addFromUri("//" + account);
                    _a = BN.bind;
                    return [4 /*yield*/, api_3.query.system.account(signer.address)];
                case 3:
                    nonce = new (_a.apply(BN, [void 0, (_c.sent()).nonce]))();
                    accountId = ss58.addressToAddressId(signer.address);
                    return [4 /*yield*/, api_3.query.swapModule.nonceMap(accountId)];
                case 4:
                    l2nonce = _c.sent();
                    return [4 /*yield*/, utils_l1_1.queryCurrentL1Account(chainId)];
                case 5:
                    l1account = _c.sent();
                    try {
                        new BN(amount);
                    }
                    catch (e) {
                        alert("Bad amount: " + amount);
                        return [2 /*return*/];
                    }
                    tx = api_3.tx.swapModule.withdraw(signer.address, l1account, compressToken(chainId, token), new BN(amount), l2nonce);
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, tx.signAndSend(signer, { nonce: nonce })];
                case 7:
                    ret = _c.sent();
                    console.log(ret);
                    return [3 /*break*/, 9];
                case 8:
                    e_4 = _c.sent();
                    alert(e_4);
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    _b = _c.sent();
                    return [2 /*return*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.withdraw = withdraw;
function checkNumberString(v, name, hex) {
    if (hex === void 0) { hex = false; }
    try {
        new BN(v, hex ? 16 : 10);
    }
    catch (e) {
        throw new Error("Invalid " + name + ": " + v);
    }
}
function compressToken(chainId, token, query) {
    if (query === void 0) { query = false; }
    checkNumberString(chainId, "chainId");
    checkNumberString(token, "token", true);
    if (query) {
        var chainIdString_1 = new BN(chainId)
            .toString(16, 24)
            .match(/.{2}/g)
            .reverse()
            .join("");
        var tokenString_1 = new BN(token, 16)
            .toString(16, 40)
            .match(/.{2}/g)
            .reverse()
            .join("");
        return tokenString_1 + chainIdString_1;
    }
    var chainIdString = new BN(chainId).toString(16, 24);
    var tokenString = new BN(token, 16).toString(16, 40);
    return new BN(chainIdString + tokenString, 16);
}
function swap(account, chain_from, token_from, chain_to, token_to, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var api, keyring, signer, nonce, _a, accountId, l2nonce, tx, ret, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAPI()];
                case 1:
                    api = _b.sent();
                    return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 2:
                    _b.sent();
                    keyring = new api_2.Keyring({ type: "sr25519" });
                    signer = keyring.addFromUri("//" + account);
                    _a = BN.bind;
                    return [4 /*yield*/, api.query.system.account(signer.address)];
                case 3:
                    nonce = new (_a.apply(BN, [void 0, (_b.sent()).nonce]))();
                    accountId = ss58.addressToAddressId(signer.address);
                    return [4 /*yield*/, api.query.swapModule.nonceMap(accountId)];
                case 4:
                    l2nonce = _b.sent();
                    try {
                        checkNumberString(token_from, "token_from", true);
                        checkNumberString(token_to, "token_to", true);
                        checkNumberString(chain_from, "chain_from");
                        checkNumberString(chain_to, "chain_to");
                        checkNumberString(amount, "amount");
                    }
                    catch (e) {
                        alert(e.message);
                        return [2 /*return*/];
                    }
                    tx = api.tx.swapModule.swap(signer.address, compressToken(chain_from, token_from), compressToken(chain_to, token_to), new BN(amount), l2nonce);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, tx.signAndSend(signer, { nonce: nonce })];
                case 6:
                    ret = _b.sent();
                    console.log(ret);
                    return [3 /*break*/, 8];
                case 7:
                    e_5 = _b.sent();
                    alert(e_5);
                    return [2 /*return*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.swap = swap;
function supply(account, chain_from, token_from, chain_to, token_to, amount_from, amount_to) {
    return __awaiter(this, void 0, void 0, function () {
        var api, keyring, signer, nonce, _a, accountId, l2nonce, tx, ret, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAPI()];
                case 1:
                    api = _b.sent();
                    return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 2:
                    _b.sent();
                    keyring = new api_2.Keyring({ type: "sr25519" });
                    console.log("l2 account name:", account);
                    signer = keyring.addFromUri("//" + account);
                    _a = BN.bind;
                    return [4 /*yield*/, api.query.system.account(signer.address)];
                case 3:
                    nonce = new (_a.apply(BN, [void 0, (_b.sent()).nonce]))();
                    accountId = ss58.addressToAddressId(signer.address);
                    return [4 /*yield*/, api.query.swapModule.nonceMap(accountId)];
                case 4:
                    l2nonce = _b.sent();
                    try {
                        checkNumberString(token_from, "token", true);
                        checkNumberString(token_to, "token", true);
                        checkNumberString(chain_from, "chain");
                        checkNumberString(chain_to, "chain");
                        checkNumberString(amount_from, "amount");
                        checkNumberString(amount_to, "amount");
                    }
                    catch (e) {
                        alert(e.message);
                        return [2 /*return*/];
                    }
                    tx = api.tx.swapModule.poolSupply(signer.address, compressToken(chain_from, token_from), compressToken(chain_to, token_to), amount_from, amount_to, l2nonce);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, tx.signAndSend(signer, { nonce: nonce })];
                case 6:
                    ret = _b.sent();
                    console.log("transaction supply:", ret);
                    return [3 /*break*/, 8];
                case 7:
                    e_6 = _b.sent();
                    alert(e_6);
                    return [2 /*return*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.supply = supply;
function retrieve(account, chain_from, token_from, chain_to, token_to, amount_from, amount_to) {
    return __awaiter(this, void 0, void 0, function () {
        var api, keyring, signer, nonce, _a, accountId, l2nonce, tx, ret, e_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getAPI()];
                case 1:
                    api = _b.sent();
                    return [4 /*yield*/, util_crypto_1.cryptoWaitReady()];
                case 2:
                    _b.sent();
                    keyring = new api_2.Keyring({ type: "sr25519" });
                    signer = keyring.addFromUri("//" + account);
                    _a = BN.bind;
                    return [4 /*yield*/, api.query.system.account(signer.address)];
                case 3:
                    nonce = new (_a.apply(BN, [void 0, (_b.sent()).nonce]))();
                    accountId = ss58.addressToAddressId(signer.address);
                    return [4 /*yield*/, api.query.swapModule.nonceMap(accountId)];
                case 4:
                    l2nonce = _b.sent();
                    try {
                        checkNumberString(token_from, "token", true);
                        checkNumberString(token_to, "token", true);
                        checkNumberString(chain_from, "chain");
                        checkNumberString(chain_to, "chain");
                        checkNumberString(amount_from, "amount");
                        checkNumberString(amount_to, "amount");
                    }
                    catch (e) {
                        alert(e.message);
                        return [2 /*return*/];
                    }
                    tx = api.tx.swapModule.poolRetrieve(signer.address, compressToken(chain_from, token_from), compressToken(chain_to, token_to), amount_from, amount_to, l2nonce);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, tx.signAndSend(signer, { nonce: nonce })];
                case 6:
                    ret = _b.sent();
                    console.log(ret);
                    return [3 /*break*/, 8];
                case 7:
                    e_7 = _b.sent();
                    alert(e_7);
                    return [2 /*return*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.retrieve = retrieve;
