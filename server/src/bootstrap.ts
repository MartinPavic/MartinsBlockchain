import { Config, saveConfig } from "./config";
import { enrollUser } from "./enrollUser";
import { registerUser } from "./registerUser";
import { Response } from "./response";

async function bootstrap(organization: string) {

  const config: Config = {
    appAdmin: organization + 'admin',
    appAdminSecret: organization + 'adminpw',
    orgMSPID: organization + 'MSP',
    organization: organization,
    caName: 'ca.' + organization + '.unizg.hr',
    gatewayDiscovery: { enabled: true, asLocalhost: true }
  }

  saveConfig(config);

  console.log('Enrolling admin for ' + organization)
  const adminCreated: Response = await enrollUser(config, config.appAdmin);
  if (!adminCreated.success) {
    throw adminCreated.error;
  }
  console.log('Admin successfully enrolled');

  console.log('Enrolling students');
  const responses: Response[] = 
    await Promise.all<Response>([
      enrollUser(config, organization + 'student1'),
      enrollUser(config, organization + 'student2'),
      enrollUser(config, organization + 'student3'),
      enrollUser(config, organization + 'student4'),
      enrollUser(config, organization + 'student5'),
    ])

  if (!responses.every(res => res.success)) {
    const errors = responses.filter(res => !res.success);
    console.error(errors.map(err => err.error).join('\n'))
    throw errors[0].error;
  }
  console.log('Students successfully enrolled');
}

bootstrap(process.argv[2])


// SHEMA DA NE MOZE FER DODJELIVAT FSBU I OBRNUTO

// RAZLICITI SERVERI ZA FER I FSB ALI ISTI NETWORK
