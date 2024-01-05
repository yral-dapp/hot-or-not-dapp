#!/usr/bin/env bash

VERSION=v$(cat "./package.json" | jq -r '.version')
CANISTERS=("configuration" "individual_user_template" "post_cache" "user_index")
DIDCMACOS="./didc/didc-macos"
DIDCLINUX="./didc/didc-macos"
DIDCARCH=""
ARCH=$(uname)

echo Update process started. Updating to $VERSION ...

if [ ! $ARCH = "Darwin" ] && [ ! $ARCH = "Linux" ]
then
  echo "Platform not compatible. Exiting ..."
  exit 1
elif [ $ARCH = "Darwin" ]
then
  if [ ! -f $DIDCMACOS ]
  then
    echo "didc-macos does not exist. Downloading ..."
    wget https://github.com/dfinity/candid/releases/latest/download/didc-macos -O "$DIDCMACOS"
    chmod +x $DIDCMACOS
  fi
  echo 'MacOS detected. Continuing ...'
  DIDCARCH=$DIDCMACOS
elif [ $ARCH = "Linux" ]
then 
  if [ ! -f $DIDCLINUX ]
  then
    echo "didc-linux does not exist. Downloading ..."
    wget https://github.com/dfinity/candid/releases/latest/download/didc-macos -O "$DIDCLINUX"
    chmod +x $DIDCLINUX
    DIDCARCH=$DIDCLINUX
  fi
  echo 'Linux detected. Continuing ...'
fi


for canister in ${CANISTERS[@]}; do
  echo Downloading latest candid for $canister canister
  wget https://github.com/go-bazzinga/hot-or-not-backend-canister/releases/download/$VERSION/$canister.did -O "./$canister/$canister.did" -q
done


for canister in ${CANISTERS[@]}; do
  echo Generating declarations for $canister canister
  $DIDCARCH bind ./$canister/$canister.did -t js > $canister/$canister.did.js
  $DIDCARCH bind ./$canister/$canister.did -t ts > $canister/$canister.did.d.ts
done

for canister in ${CANISTERS[@]}; do
  rm "./$canister/$canister.did"
done

echo Update process ended. Updated to $VERSION.