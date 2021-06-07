#!/bin/bash

function createfer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/fer.unizg.hr/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/fer.unizg.hr/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-fer --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-fer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-fer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-fer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-fer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-fer --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering ferstudent1"
  set -x
  fabric-ca-client register --caname ca-fer --id.name ferstudent1 --id.secret ferstudent1pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering ferstudent2"
  set -x
  fabric-ca-client register --caname ca-fer --id.name ferstudent2 --id.secret ferstudent2pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering ferstudent3"
  set -x
  fabric-ca-client register --caname ca-fer --id.name ferstudent3 --id.secret ferstudent3pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering ferstudent4"
  set -x
  fabric-ca-client register --caname ca-fer --id.name ferstudent4 --id.secret ferstudent4pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering ferstudent5"
  set -x
  fabric-ca-client register --caname ca-fer --id.name ferstudent5 --id.secret ferstudent5pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-fer --id.name feradmin --id.secret feradminpw --id.type admin --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/msp" --csr.hosts peer0.fer.unizg.hr --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls" --enrollment.profile tls --csr.hosts peer0.fer.unizg.hr --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/keystore/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/fer.unizg.hr/tlsca"
  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/tlsca/tlsca.fer.unizg.hr-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/fer.unizg.hr/ca"
  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/fer.unizg.hr/ca/ca.fer.unizg.hr-cert.pem"

  infoln "Generating the student1 msp"
  set -x
  fabric-ca-client enroll -u https://ferstudent1:ferstudent1pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student1@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student1@fer.unizg.hr/msp/config.yaml"

  infoln "Generating the student2 msp"
  set -x
  fabric-ca-client enroll -u https://ferstudent2:ferstudent2pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student2@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student2@fer.unizg.hr/msp/config.yaml"

  infoln "Generating the student3 msp"
  set -x
  fabric-ca-client enroll -u https://ferstudent3:ferstudent3pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student3@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student3@fer.unizg.hr/msp/config.yaml"

  infoln "Generating the student4 msp"
  set -x
  fabric-ca-client enroll -u https://ferstudent4:ferstudent4pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student4@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student4@fer.unizg.hr/msp/config.yaml"

  infoln "Generating the student5 msp"
  set -x
  fabric-ca-client enroll -u https://ferstudent5:ferstudent5pw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student5@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Student5@fer.unizg.hr/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://feradmin:feradminpw@localhost:7054 --caname ca-fer -M "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Admin@fer.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fer/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fer.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Admin@fer.unizg.hr/msp/config.yaml"
}

function createfsb() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/fsb.unizg.hr/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/fsb.unizg.hr/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-fsb --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-fsb.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-fsb.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-fsb.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-fsb.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering fsbstudent1"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbstudent1 --id.secret fsbstudent1pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering fsbstudent2"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbstudent2 --id.secret fsbstudent2pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering fsbstudent3"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbstudent3 --id.secret fsbstudent3pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering fsbstudent4"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbstudent4 --id.secret fsbstudent4pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering fsbstudent5"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbstudent5 --id.secret fsbstudent5pw --id.type client --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-fsb --id.name fsbadmin --id.secret fsbadminpw --id.type admin --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/msp" --csr.hosts peer0.fsb.unizg.hr --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls" --enrollment.profile tls --csr.hosts peer0.fsb.unizg.hr --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/keystore/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/tlsca"
  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/tlsca/tlsca.fsb.unizg.hr-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/ca"
  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/ca/ca.fsb.unizg.hr-cert.pem"

  infoln "Generating the student1 msp"
  set -x
  fabric-ca-client enroll -u https://fsbstudent1:fsbstudent1pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student1@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student1@fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the student2 msp"
  set -x
  fabric-ca-client enroll -u https://fsbstudent2:fsbstudent2pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student2@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student2@fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the student3 msp"
  set -x
  fabric-ca-client enroll -u https://fsbstudent3:fsbstudent3pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student3@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student3@fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the student4 msp"
  set -x
  fabric-ca-client enroll -u https://fsbstudent4:fsbstudent4pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student4@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student4@fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the student5 msp"
  set -x
  fabric-ca-client enroll -u https://fsbstudent5:fsbstudent5pw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student5@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Student5@fsb.unizg.hr/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://fsbadmin:fsbadminpw@localhost:8054 --caname ca-fsb -M "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Admin@fsb.unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/fsb/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/msp/config.yaml" "${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Admin@fsb.unizg.hr/msp/config.yaml"
}

function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/unizg.hr

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/unizg.hr

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/unizg.hr/msp/config.yaml"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/msp" --csr.hosts orderer.unizg.hr --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls" --enrollment.profile tls --csr.hosts orderer.unizg.hr --csr.hosts localhost --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/msp/tlscacerts/tlsca.unizg.hr-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/unizg.hr/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/unizg.hr/msp/tlscacerts/tlsca.unizg.hr-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/unizg.hr/users/Admin@unizg.hr/msp" --tls.certfiles "${PWD}/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/unizg.hr/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/unizg.hr/users/Admin@unizg.hr/msp/config.yaml"
}
