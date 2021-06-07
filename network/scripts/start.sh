#!/bin/bash

export PATH=${PWD}/bin:$PATH
export FABRIC_CFG_PATH=${PWD}
export VERBOSE=true

# Using crpto vs CA. default is cryptogen
CRYPTO="Certificate Authorities"
# timeout duration - the duration the CLI should wait for a response from
# another container before giving up
MAX_RETRY=5
# default for delay between commands
CLI_DELAY=3
# channel name defaults to "mychannel"
CHANNEL_NAME="mychannel"
# chaincode name defaults to "NA"
CC_NAME="mychaincode"
# chaincode path defaults to "NA"
CC_SRC_PATH="../../chaincodes/mychaincode/index.ts"
# endorsement policy defaults to "NA". This would allow chaincodes to use the majority default policy.
CC_END_POLICY="NA"
# collection configuration defaults to "NA"
CC_COLL_CONFIG="NA"
# chaincode init function defaults to "NA"
CC_INIT_FCN="NA"
# use this as the default docker-compose yaml definition
COMPOSE_FILE_BASE=docker/docker-compose-dev-net.yaml
# docker-compose.yaml file if you are using couchdb
COMPOSE_FILE_COUCH=docker/docker-compose-couch.yaml
# certificate authorities compose file
COMPOSE_FILE_CA=docker/docker-compose-ca.yaml

# chaincode language defaults to "NA"
CC_SRC_LANGUAGE="typescript"
# Chaincode version
CC_VERSION="1.0"
# Chaincode definition sequence
CC_SEQUENCE=1
# default database
DATABASE="couchdb"

. scripts/utils.sh

function createOrgs() {
  if [ -d "organizations/peerOrganizations" ]; then
    rm -Rf organizations/peerOrganizations && rm -Rf organizations/ordererOrganizations
  fi
  # Create crypto material using cryptogen
  if [ "$CRYPTO" == "Certificate Authorities" ]; then
    infoln "Generating certificates using Fabric CA"
    docker-compose -f $COMPOSE_FILE_CA up -d 2>&1

    . fabric-ca/registerEnroll.sh

  while :
    do
      if [ ! -f "fabric-ca/fer/tls-cert.pem" ]; then
        sleep 1
      else
        break
      fi
    done

    infoln "Creating fer Identities"

    createfer

    infoln "Creating fsb Identities"

    createfsb

    infoln "Creating Orderer Org Identities"

    createOrderer

  fi

  infoln "Generating CCP files for fer and fsb"
  ./crypto-config/ccp-generate.sh
}

# Bring up the peer and orderer nodes using docker compose.
# generate artifacts if they don't exist
if [ ! -d "organizations/peerOrganizations" ]; then
  createOrgs
fi

COMPOSE_FILES="-f ${COMPOSE_FILE_BASE}"

if [ "${DATABASE}" == "couchdb" ]; then
  COMPOSE_FILES="${COMPOSE_FILES} -f ${COMPOSE_FILE_COUCH}"
fi

docker-compose ${COMPOSE_FILES} up -d 2>&1

docker ps -a
if [ $? -ne 0 ]; then
  fatalln "Unable to start network"
fi

./scripts/createChannel.sh
./scripts/deployCC.sh erc20
./scripts/deployCC.sh erc721
