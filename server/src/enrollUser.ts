/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

import * as FabricCAServices from "fabric-ca-client";
import { Wallets, X509Identity } from "fabric-network";
import { Config, getConnectionFile } from "./config";
import * as path from "path";
import { Response } from "./response";

const connectionFile = getConnectionFile()

export async function enrollUser(config: Config, userName: string): Promise<Response> {
  try {

    // Create a new CA client for interacting with the CA.
    const caURL = connectionFile.certificateAuthorities[config.caName].url;
    const ca = new FabricCAServices(caURL);
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.get(userName);
    if (adminExists) {
      const err = `An identity for the user ${userName} already exists in the wallet`;
      console.error(err);
      return Response.fail(new Error(err));
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: userName,
      enrollmentSecret: userName + 'pw',
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
    return Response.success(
      [`Successfully enrolled user ${userName} and imported it into the wallet`]
    );
  } catch (error) {
    console.error(`Failed to enroll admin user: ${userName} ${error}`);
    return Response.fail(error);
  }
}
