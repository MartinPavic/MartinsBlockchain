
if [ ! -d "nfts" ]
then
    mkdir "nfts"
fi
npm run build

node dist/bootstrap.js $1

./updateKeystore.sh

npm run start