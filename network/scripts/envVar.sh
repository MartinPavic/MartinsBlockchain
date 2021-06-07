#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/msp/tlscacerts/tlsca.unizg.hr-cert.pem
export PEER0_fer_CA=${PWD}/organizations/peerOrganizations/fer.unizg.hr/peers/peer0.fer.unizg.hr/tls/ca.crt
export PEER0_fsb_CA=${PWD}/organizations/peerOrganizations/fsb.unizg.hr/peers/peer0.fsb.unizg.hr/tls/ca.crt
export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/server.crt
export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/organizations/ordererOrganizations/unizg.hr/orderers/orderer.unizg.hr/tls/server.key

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG = "fer" ]; then
    export CORE_PEER_LOCALMSPID="ferMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_fer_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/fer.unizg.hr/users/Admin@fer.unizg.hr/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG = "fsb" ]; then
    export CORE_PEER_LOCALMSPID="fsbMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_fsb_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/fsb.unizg.hr/users/Admin@fsb.unizg.hr/msp
    export CORE_PEER_ADDRESS=localhost:9051
  else
    errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  setGlobals $1

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  if [ $USING_ORG = "fer" ]; then
    export CORE_PEER_ADDRESS=peer0.fer.unizg.hr:7051
  elif [ $USING_ORG = "fsb" ]; then
    export CORE_PEER_ADDRESS=peer0.fsb.unizg.hr:9051
  else
    errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=()
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
    PEER="peer0.$1"
    ## Set peer addresses
    if [ -z "$PEERS" ]
    then
	PEERS="$PEER"
    else
	PEERS="$PEERS $PEER"
    fi
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" --peerAddresses $CORE_PEER_ADDRESS)
    ## Set path to TLS certificate
    CA=PEER0_$1_CA
    TLSINFO=(--tlsRootCertFiles "${!CA}")
    PEER_CONN_PARMS=("${PEER_CONN_PARMS[@]}" "${TLSINFO[@]}")
    # shift by one to get to the next organization
    shift
  done
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}
