import { Wallets, X509Identity } from "fabric-network";
import * as FabricCAServices from "fabric-ca-client";
import * as path from "path";
import { Config, getConnectionFile } from "./config";
import { Response } from "./response";


export async function registerUser(
  config: Config,
  userName: string
): Promise<Response> {
  try {
    const connectionFile = getConnectionFile();
    // Create a new CA client for interacting with the CA.
    const caInfo = connectionFile.certificateAuthorities[config.caName];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
    
    
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(userName);

    if (userIdentity) {
      const err = `An identity for the user ${userName} already exists in the wallet`;
      console.error(err);
      return Response.fail(new Error(err));
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get(config.appAdmin);
    if (!adminIdentity) {
      const err = `An identity for the admin user ${config.appAdmin} does not exist in the wallet`;
      return Response.fail(new Error(err));
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);

    const adminUser = await provider.getUserContext(
      adminIdentity,
      config.appAdmin
    );
    
    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: config.organization + ".department1",
        enrollmentID: userName,
        role: "client",
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: userName,
      enrollmentSecret: secret,
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.orgMSPID,
      type: "X.509",
    };
    await wallet.put(userName, x509Identity);
    
    return Response.success([
      `Successfully registered and enrolled user ${userName} and imported it into the wallet`,
    ]);
  } catch (error) {
    return Response.fail(error);
  }
}
