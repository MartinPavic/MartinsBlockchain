#!/bin/bash

ORG_1_KEYSTORE=$(ls ../network/organizations/peerOrganizations/fer.unizg.hr/users/Admin\@fer.unizg.hr/msp/keystore/)
ORG_2_KEYSTORE=$(ls ../network/organizations/peerOrganizations/fsb.unizg.hr/users/Admin\@fsb.unizg.hr/msp/keystore/)

ORG_1_PATH_TO_KEYSTORE="Admin@fer.unizg.hr/msp/keystore/"
ORG_2_PATH_TO_KEYSTORE="Admin@fsb.unizg.hr/msp/keystore/"

UPDATED_KEYSTORE_ORG_1="$ORG_1_PATH_TO_KEYSTORE$ORG_1_KEYSTORE"
UPDATED_KEYSTORE_ORG_2="$ORG_2_PATH_TO_KEYSTORE$ORG_2_KEYSTORE"

# sed -i "s|keystore/.*|${UPDATED_KEYSTORE}|g" connection.yaml
# .* is regex-ese for "any character followed by zero or more of any character(s)"

echo 'updating connection.yaml fer adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_1}

sed -i -e "s|Admin@fer.unizg.hr/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_1|g" connection.yaml

echo 'updating connection.yaml fsb adminPrivateKey path with' ${UPDATED_KEYSTORE_ORG_2}

sed -i -e "s|Admin@fsb.unizg.hr/msp/keystore/.*|$UPDATED_KEYSTORE_ORG_2|g" connection.yaml
