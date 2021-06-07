. scripts/utils.sh

function clearContainers() {
  infoln "Removing remaining containers"
  docker rm -f $(docker ps -aq --filter label=service=hyperledger-fabric) 2>/dev/null || true
  docker rm -f $(docker ps -aq --filter name='dev-peer*') 2>/dev/null || true
}

function removeUnwantedImages() {
  infoln "Removing generated chaincode docker images"
  docker image rm -f $(docker images -aq --filter reference='dev-peer*') 2>/dev/null || true
}

# Tear down running network
function networkDown() {
  docker-compose -f $COMPOSE_FILE_BASE -f $COMPOSE_FILE_COUCH -f $COMPOSE_FILE_CA down --volumes --remove-orphans
  # Don't remove the generated artifacts -- note, the ledgers are always removed
  if [ "$MODE" != "restart" ]; then
    # Bring down the network, deleting the volumes
    #Cleanup the chaincode containers
    clearContainers
    #Cleanup images
    removeUnwantedImages
    # remove orderer block and other channel configuration transactions and certs
    docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations'
    ## remove fabric ca artifacts
    docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/peerOrganizations/fer/msp organizations/peerOrganizations/fer/tls-cert.pem organizations/peerOrganizations/fer/ca-cert.pem organizations/peerOrganizations/fer/IssuerPublicKey organizations/peerOrganizations/fer/IssuerRevocationPublicKey organizations/peerOrganizations/fer/peerOrganizations-server.db'
    docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/peerOrganizations/fsb/msp organizations/peerOrganizations/fsb/tls-cert.pem organizations/peerOrganizations/fsb/ca-cert.pem organizations/peerOrganizations/fsb/IssuerPublicKey organizations/peerOrganizations/fsb/IssuerRevocationPublicKey organizations/peerOrganizations/fsb/peerOrganizations-server.db'
    docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/peerOrganizations/ordererOrg/msp organizations/peerOrganizations/ordererOrg/tls-cert.pem organizations/peerOrganizations/ordererOrg/ca-cert.pem organizations/peerOrganizations/ordererOrg/IssuerPublicKey organizations/peerOrganizations/ordererOrg/IssuerRevocationPublicKey organizations/peerOrganizations/ordererOrg/peerOrganizations-server.db'
    # remove channel and script artifacts
    docker run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf channel-artifacts log.txt *.tar.gz'
  fi
}

rm -rf channel-artifacts
rmdir system-genesis-block/genesis.block
networkDown
docker system prune
docker container prune
docker volume prune