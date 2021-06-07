import * as express from "express";
import * as cors from "cors";
import * as morgan from "morgan";
import * as network from "./network";
import { Wallets } from "fabric-network";
import * as path from "path";
import * as fs from 'fs';
import { Response } from "response";

const app = express();
app.use(morgan("combined"));
app.use(express.json());
app.use(cors());

app.route("/points")
  .get(async (req, res) => {
    const response = await network.QueryAllPoints();
    response.success
      ? res.status(200).json(response.data)
      : res.status(400).send(response.error.message);
  })
  .post(async (req, res) => {
    const response = await network.MintPoints(req.body.numOfPoints);
    response.success
      ? res.status(200).json(req.body)
      : res.status(400).send(response.error.message);
  });
app.route("/points/:userId")
  .put(async (req, res) => {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userIdentity = await wallet.get(req.params.userId);
    const response = await network.TransferPointsToStudent(req.body.numOfPoints, userIdentity);
    response.success ? res.status(200).json(response.data[0]) : res.status(404).send();
  })

app.route("/organization").get(async (req, res) => {
  const organization: Response = await network.GetUserID();
  console.log(organization.data)
  const balance: Response = await network.GetCurrentOrgBalance();
  res.json({
    id: extractOrganizationId(organization.data),
    name: extractOrganizationName(organization.data),
    balance: balance.data[0],
  });
});

const extractOrganizationId = (value: string) => {
  const split = value.split("/");
  return split[6].slice(2);
};
const extractOrganizationName = (value: string) => {
  const id = extractOrganizationId(value);
  return id.slice(0, 3).toUpperCase();
};

app.route("/users").get(async (req, res) => {
  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const userIdentities = (await wallet.list()).filter(value => !value.includes('admin'));
  const balances = await Promise.all(
    userIdentities.map((user) => network.GetUserBalance(user))
  );
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
});

app.route("/users/:id")
  .get(async (req, res) => {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userIdentity = await wallet.get(req.params.id);
    userIdentity ? res.status(200).json(userIdentity) : res.status(404).send();
  })
  

app.route("/awards")
  .post(async (req, res) => {
    const response = await network.MintAward(req.body.id)
    const token = response.data;
    const tokenPath = path.join(process.cwd(), "nfts", `${token.id}.json`);
    fs.writeFileSync(tokenPath, JSON.stringify(token));
    response.success ? res.status(200).send(token) : res.status(400).send(response.error.message)
  })
  .get(async (req, res) => {
    const response = await network.GetAwardsSupply()
    response.success ? res.status(200).send(response.data[0]) : res.status(400).send(response.error.message)
  })

app.route("/awards/:studentId")
  .put(async (req, res) => {
    const studentId = await network.GetUserID(req.params.studentId);
    const response = await network.ApproveAwardForStudent(studentId.data, req.body.awardId);
    if (response.success) {
      const token = { id: req.body.awardId, holder: req.params.studentId }
      const tokenPath = path.join(process.cwd(), "nfts", `${token.id}.json`);
      fs.writeFileSync(tokenPath, JSON.stringify(token));
      res.status(200).json(response.data)
    } else {
      res.status(404).send(response.error.message)
    }
  })


app.listen(process.env.PORT || 8000);
