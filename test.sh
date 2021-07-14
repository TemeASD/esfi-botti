#!/usr/bin/env bash
NAME=${1?Error: no name given}
NAME2=${2:-friend}
echo "HELLO! $NAME and $NAME2"

read -p 'TEST: ' VARNAME

echo "HELLO" $VARNAME