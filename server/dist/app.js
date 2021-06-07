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
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const network = require("./network");
const fabric_network_1 = require("fabric-network");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());
app.route("/points")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield network.QueryAllPoints();
    response.success
        ? res.status(200).json(response.data)
        : res.status(400).send(response.error.message);
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield network.MintPoints(req.body.numOfPoints);
    response.success
        ? res.status(200).json(req.body)
        : res.status(400).send(response.error.message);
}));
app.route("/points/:userId")
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
    const userIdentity = yield wallet.get(req.params.userId);
    const response = yield network.TransferPointsToStudent(req.body.numOfPoints, userIdentity);
    response.success ? res.status(200).json(response.data[0]) : res.status(404).send();
}));
app.route("/organization").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const organization = yield network.GetUserID();
    console.log(organization.data);
    const balance = yield network.GetCurrentOrgBalance();
    res.json({
        id: extractOrganizationId(organization.data),
        name: extractOrganizationName(organization.data),
        balance: balance.data[0],
    });
}));
const extractOrganizationId = (value) => {
    const split = value.split("/");
    return split[6].slice(2);
};
const extractOrganizationName = (value) => {
    const id = extractOrganizationId(value);
    return id.slice(0, 3).toUpperCase();
};
app.route("/users").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
    const userIdentities = (yield wallet.list()).filter(value => !value.includes('admin'));
    const balances = yield Promise.all(userIdentities.map((user) => network.GetUserBalance(user)));
    let usersAndBalances = [];
    for (let i = 0; i < userIdentities.length; i++) {
        usersAndBalances.push({
            id: userIdentities[i],
            balance: balances[i].data ? Number(balances[i].data[0]) : 0,
        });
    }
    usersAndBalances
        ? res.status(200).json(usersAndBalances)
        : res.status(404).send();
}));
app.route("/users/:id")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
    const userIdentity = yield wallet.get(req.params.id);
    userIdentity ? res.status(200).json(userIdentity) : res.status(404).send();
}));
app.route("/awards")
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield network.MintAward(req.body.id);
    const token = response.data;
    const tokenPath = path.join(process.cwd(), "nfts", `${token.id}.json`);
    fs.writeFileSync(tokenPath, JSON.stringify(token));
    response.success ? res.status(200).send(token) : res.status(400).send(response.error.message);
}))
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield network.GetAwardsSupply();
    response.success ? res.status(200).send(response.data[0]) : res.status(400).send(response.error.message);
}));
app.route("/awards/:studentId")
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = yield network.GetUserID(req.params.studentId);
    const response = yield network.ApproveAwardForStudent(studentId.data[0].toString(), req.body.awardId);
    response.success ? res.status(200).json(response.data[0]) : res.status(404).send();
}));
app.listen(process.env.PORT || 8000);
//# sourceMappingURL=app.js.map