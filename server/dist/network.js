'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveAwardForStudent = exports.GetAwardsSupply = exports.GetName = exports.SetNameAndSymbol = exports.MintAward = exports.GetUserBalance = exports.GetCurrentOrgBalance = exports.GetUserID = exports.QueryAllPoints = exports.TransferPointsToStudent = exports.MintPoints = void 0;
const fabric_network_1 = require("fabric-network");
const path = require("path");
const config_1 = require("./config");
const response_1 = require("./response");
const config = config_1.getConfig();
const connectionFile = config_1.getConnectionFile();
function _submitTransaction(contractName, transaction, args, identity = config.appAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const walletPath = path.join(process.cwd(), '/wallet');
            const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            const exists = yield wallet.get(identity);
            if (!exists) {
                console.log('An identity for the user ' + identity + ' does not exist in the wallet');
                return response_1.Response.fail(new Error('Unauthorized'));
            }
            const gateway = new fabric_network_1.Gateway();
            yield gateway.connect(connectionFile, { wallet, identity, discovery: config.gatewayDiscovery });
            const network = yield gateway.getNetwork('mychannel');
            const contract = network.getContract(contractName);
            const resultBuffer = yield contract.submitTransaction(transaction, ...args);
            gateway.disconnect();
            return response_1.Response.success(resultBuffer.toString());
        }
        catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            return response_1.Response.fail(error);
        }
    });
}
function MintPoints(numOfPoints) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'Mint', [numOfPoints.toString()]);
    });
}
exports.MintPoints = MintPoints;
function TransferPointsToStudent(numOfPoints, student) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'Transfer', [student, numOfPoints.toString()]);
    });
}
exports.TransferPointsToStudent = TransferPointsToStudent;
function QueryAllPoints() {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'TotalSupply', []);
    });
}
exports.QueryAllPoints = QueryAllPoints;
function GetUserID(user = config.appAdmin) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'ClientAccountID', [], user);
    });
}
exports.GetUserID = GetUserID;
function GetCurrentOrgBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'ClientAccountBalance', []);
    });
}
exports.GetCurrentOrgBalance = GetCurrentOrgBalance;
function GetUserBalance(user) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc20', 'ClientAccountBalance', [], user);
    });
}
exports.GetUserBalance = GetUserBalance;
function MintAward(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc721', 'MintWithTokenURI', [id, 'https://fer.unizg.hr/' + id]);
    });
}
exports.MintAward = MintAward;
function SetNameAndSymbol(name, symbol) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc721', 'SetOption', [name, symbol]);
    });
}
exports.SetNameAndSymbol = SetNameAndSymbol;
function GetName() {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc721', 'Name', []);
    });
}
exports.GetName = GetName;
function GetAwardsSupply() {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc721', 'TotalSupply', []);
    });
}
exports.GetAwardsSupply = GetAwardsSupply;
function ApproveAwardForStudent(student, award) {
    return __awaiter(this, void 0, void 0, function* () {
        return _submitTransaction('erc721', 'Approve', [student, award]);
    });
}
exports.ApproveAwardForStudent = ApproveAwardForStudent;
//# sourceMappingURL=network.js.map