if [ $1 ]; then
  cd network
  ./scripts/start.sh

  cd ../server
  ./start.sh $1
else
  echo 'You need to provide organization (fer/fsb)'
fi



