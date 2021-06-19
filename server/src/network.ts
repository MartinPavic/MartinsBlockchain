
'use strict';

import { Wallets, Gateway, Identity } from 'fabric-network';
import * as path from 'path';
import { getConnectionFile, getConfig } from './config';
import { Response } from './response';

const config = getConfig()
const connectionFile = getConnectionFile()

async function _submitTransaction(contractName: string, transaction: string, args: string[], identity = config.appAdmin): Promise<Response> {
  try {
    const walletPath = path.join(process.cwd(), '/wallet')
    const wallet = await Wallets.newFileSystemWallet(walletPath)
    const exists = await wallet.get(identity)
    if (!exists) {
      console.log('An identity for the user ' + identity + ' does not exist in the wallet');
      return Response.fail(new Error('Unauthorized'))
    }

    const gateway = new Gateway();
    await gateway.connect(connectionFile, { wallet, identity, discovery: config.gatewayDiscovery })

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract(contractName);
    const resultBuffer = await contract.submitTransaction(transaction, ...args)

    gateway.disconnect();
    return Response.success(resultBuffer.toString())

  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`)
    return Response.fail(error)
  }
}

export async function MintPoints(numOfPoints: number): Promise<Response> {
  return _submitTransaction('erc20', 'Mint', [numOfPoints.toString()]);
}

export async function TransferPointsToStudent(numOfPoints: number, student: any) {
  return _submitTransaction('erc20', 'Transfer', [student, numOfPoints.toString()])
}

export async function QueryAllPoints() {
  return _submitTransaction('erc20', 'TotalSupply', [])
}

export async function GetUserID(user: string = config.appAdmin) {
  return _submitTransaction('erc20', 'ClientAccountID', [], user)
}

export async function GetCurrentOrgBalance() {
  return _submitTransaction('erc20', 'ClientAccountBalance', [])
}

export async function GetUserBalance(user: string) {
  return _submitTransaction('erc20', 'BalanceOf', [user])
}

export async function MintAward(id: string) {
  return _submitTransaction('erc721', 'MintWithTokenURI', [id, 'https://fer.unizg.hr/' + id])
}

export async function SetNameAndSymbol(name: string, symbol: string) {
  return _submitTransaction('erc721', 'SetOption', [name, symbol])
}

export async function GetName() {
  return _submitTransaction('erc721', 'Name', [])
}

export async function GetAwardsSupply() {
  return _submitTransaction('erc721', 'TotalSupply', [])
}

export async function ApproveAwardForStudent(student: string, award: string) {
  return _submitTransaction('erc721', 'Approve', [student, award])
}

