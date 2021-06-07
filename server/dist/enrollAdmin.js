/*
 * SPDX-License-Identifier: Apache-2.0
 */
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
exports.enrollAdmin = void 0;
const FabricCAServices = require("fabric-ca-client");
const fabric_network_1 = require("fabric-network");
const config_1 = require("./config");
const path = require("path");
const response_1 = require("./response");
function enrollAdmin(config) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connectionFile = config_1.getConnectionFile(config.organization);
            // Create a new CA client for interacting with the CA.
            const caURL = connectionFile.certificateAuthorities[config.caName].url;
            const ca = new FabricCAServices(caURL);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            // Check to see if we've already enrolled the admin user.
            const adminExists = yield wallet.get(config.appAdmin);
            if (adminExists) {
                const err = `An identity for the admin user ${config.appAdmin} already exists in the wallet`;
                console.error(err);
                return response_1.Response.fail(new Error(err));
            }
            // Enroll the admin user, and import the new identity into the wallet.
            const enrollment = yield ca.enroll({
                enrollmentID: config.appAdmin,
                enrollmentSecret: config.appAdminSecret,
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: config.orgMSPID,
                type: "X.509",
            };
            yield wallet.put(config.appAdmin, x509Identity);
            return response_1.Response.success([`Successfully enrolled admin user ${config.appAdmin} and imported it into the wallet`]);
        }
        catch (error) {
            console.error(`Failed to enroll admin user: ${config.appAdmin} ${error}`);
            return response_1.Response.fail(error);
        }
    });
}
exports.enrollAdmin = enrollAdmin;
//# sourceMappingURL=enrollAdmin.js.map