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
exports.queryCurrentL1Account = exports.queryBalanceOnL1 = exports.deposit = void 0;
var BN = require("bn.js");
var abi = require("solidity/clients/bridge/abi");
var ss58 = require("substrate-ss58");
var configSelector = require("../config/config-selector");
function getBridge(chainId, mode) {
    if (mode === void 0) { mode = true; }
    return __awaiter(this, void 0, void 0, function () {
        var bridge, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("getBridge", configSelector.configMap[chainId]);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, abi.getBridge(configSelector.configMap[chainId], mode)];
                case 2:
                    bridge = _a.sent();
                    return [2 /*return*/, bridge];
                case 3:
                    e_1 = _a.sent();
                    if (e_1.message === "UnmatchedNetworkId") {
                        alert("Please switch your metamask to correct chain!");
                    }
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deposit(accountAddress, chainId, tokenAddress, // hex without 0x prefix
amount, progress, error) {
    return __awaiter(this, void 0, void 0, function () {
        var bridge, token_address, token_id, r, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('call deposit');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, getBridge(chainId)];
                case 2:
                    bridge = _a.sent();
                    token_address = "0x" + tokenAddress;
                    token_id = ss58.addressToAddressId(accountAddress);
                    r = bridge.deposit(token_address, parseInt(amount), token_id);
                    r.when("snapshot", "Approve", function () { return progress("Approve", "Wait confirm ...", "", 10); })
                        .when("Approve", "transactionHash", function (tx) { return progress("Approve", "Transaction Sent", tx, 20); })
                        .when("Approve", "receipt", function (tx) { return progress("Approve", "Done", tx.blockHash, 30); })
                        .when("snapshot", "Deposit", function () { return progress("Deposit", "Wait confirm ...", "", 40); })
                        .when("Deposit", "transactionHash", function (tx) { return progress("Desposit", "Transaction Sent", tx, 50); })
                        .when("Deposit", "receipt", function (tx) { return progress("Deposit", "Done", tx.blockHash, 70); });
                    return [4 /*yield*/, r];
                case 3:
                    _a.sent();
                    progress("Finalize", "Done", "", 100);
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    error(e_2.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.deposit = deposit;
function queryBalanceOnL1(accountAddress, tokenChainId, tokenAddress, fromChainId) {
    return __awaiter(this, void 0, void 0, function () {
        var bridge, fullTokenAddress, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBridge(fromChainId, false)];
                case 1:
                    bridge = _a.sent();
                    fullTokenAddress = new BN(tokenChainId).shln(160).add(new BN(tokenAddress, 16));
                    console.log(fullTokenAddress.toString(16), ss58.addressToAddressId(accountAddress));
                    return [4 /*yield*/, bridge.balanceOf(ss58.addressToAddressId(accountAddress), "0x" + fullTokenAddress.toString(16))];
                case 2:
                    balance = _a.sent();
                    return [2 /*return*/, balance];
            }
        });
    });
}
exports.queryBalanceOnL1 = queryBalanceOnL1;
function queryCurrentL1Account(chainId) {
    return __awaiter(this, void 0, void 0, function () {
        var bridge;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBridge(chainId)];
                case 1:
                    bridge = _a.sent();
                    return [2 /*return*/, bridge.encode_l1address(bridge.account)];
            }
        });
    });
}
exports.queryCurrentL1Account = queryCurrentL1Account;
