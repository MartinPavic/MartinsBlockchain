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
exports.registerUser = void 0;
const fabric_network_1 = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const config_1 = require("./config");
const response_1 = require("./response");
function registerUser(config, userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connectionFile = config_1.getConnectionFile();
            // Create a new CA client for interacting with the CA.
            const caInfo = connectionFile.certificateAuthorities[config.caName];
            const caTLSCACerts = caInfo.tlsCACerts.pem;
            const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), "wallet");
            const wallet = yield fabric_network_1.Wallets.newFileSystemWallet(walletPath);
            // Check to see if we've already enrolled the user.
            const userIdentity = yield wallet.get(userName);
            if (userIdentity) {
                const err = `An identity for the user ${userName} already exists in the wallet`;
                console.error(err);
                return response_1.Response.fail(new Error(err));
            }
            // Check to see if we've already enrolled the admin user.
            const adminIdentity = yield wallet.get(config.appAdmin);
            if (!adminIdentity) {
                const err = `An identity for the admin user ${config.appAdmin} does not exist in the wallet`;
                return response_1.Response.fail(new Error(err));
            }
            // build a user object for authenticating with the CA
            const provider = wallet
                .getProviderRegistry()
                .getProvider(adminIdentity.type);
            const adminUser = yield provider.getUserContext(adminIdentity, config.appAdmin);
            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = yield ca.register({
                affiliation: config.organization + ".department1",
                enrollmentID: userName,
                role: "client",
            }, adminUser);
            const enrollment = yield ca.enroll({
                enrollmentID: userName,
                enrollmentSecret: secret,
            });
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: config.orgMSPID,
                type: "X.509",
            };
            yield wallet.put(userName, x509Identity);
            return response_1.Response.success([
                `Successfully registered and enrolled user ${userName} and imported it into the wallet`,
            ]);
        }
        catch (error) {
            return response_1.Response.fail(error);
        }
    });
}
exports.registerUser = registerUser;
//# sourceMappingURL=registerUser.js.map