import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface Config {
  appAdmin: string;
  appAdminSecret: string;
  organization: string;
  orgMSPID: string;
  caName: string;
  gatewayDiscovery: object;
}

export function getConfig(): Config {
  const filePath = path.join(process.cwd(), 'config.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents) as Config;
}

export function saveConfig(config: Config): void {
  const filePath = path.join(process.cwd(), 'config.json');
  fs.writeFileSync(filePath, JSON.stringify(config));
}

export function getConnectionFile() {
  const filePath = path.resolve(process.cwd(), 'connection.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const connectionFile = yaml.load(fileContents) as any;
  return connectionFile
}