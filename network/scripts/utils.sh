function println() {
  echo -e "$1"
}

function fatalln() {
  println "$1"
  exit 1
}

function infoln() {
  println "$1"
}

function successln() {
  println "$1"
}

function errorln() {
  println "error: $1"
}

export -f infoln
export -f fatalln
export -f successln
export -f errorln