#!/bin/bash

# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

function do_update_frontend() {
    (
        echo 'update the backend'
        cd ../mmm/
        git pull
        npm run build
    )
}

function do_update_backend() {
    echo 'update the frontend'
    git pull
    docker-compose build
    docker-compose up -d
}

while getopts "h?fba" opt; do
    case "$opt" in
        h|\?)
            echo ./update.sh -f # update the frontend
            echo ./update.sh -b # update the backend
            echo ./update.sh -a # update both the frontend and backend
            exit 0
        ;;
        f)
            do_update_frontend
        ;;
        b)
            do_update_backend
        ;;
        a)
            do_update_frontend
            do_update_backend
        ;;
    esac
done

shift $((OPTIND-1))

[ "${1:-}" = "--" ] && shift

# echo "Leftovers: $@"

# End of file