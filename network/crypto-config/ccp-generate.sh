#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        crypto-config/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        crypto-config/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=fer
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/fer.unizg.hr/tlsca/tlsca.fer.unizg.hr-cert.pem
CAPEM=organizations/peerOrganizations/fer.unizg.hr/ca/ca.fer.unizg.hr-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/fer.unizg.hr/connection-fer.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/fer.unizg.hr/connection-fer.yaml

ORG=fsb
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/fsb.unizg.hr/tlsca/tlsca.fsb.unizg.hr-cert.pem
CAPEM=organizations/peerOrganizations/fsb.unizg.hr/ca/ca.fsb.unizg.hr-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/fsb.unizg.hr/connection-fsb.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/fsb.unizg.hr/connection-fsb.yaml
