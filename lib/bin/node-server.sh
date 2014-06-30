#! /bin/sh

DIR = `pwd`
NODE = `which node`
PIDFILE = `../server.pid`

#get action
ACTION = $1

#help
usage(){
    echo "Usage: ./node-server.sh {start|stop|restart}"
    exit 1;
}

get_pid(){
    if [ -f $PIDFILE ]; then
        echo `cat $PIDFILE`
    fi
}

#start server
start(){
    pid = `get_pid`

    if [ ! -z $pid ]; then
        echo 'server is already running'
    else
        $NODE $DIR/run-server.js -m dev 2>&1 &
        echo 'server is running'
    fi
}

#stop server
stop(){
    pid = `get_pid`

    if [ ! -z $pid ]; then
        echo 'server not running'
    else
        echo 'server is stopping ...'
        kill -15 $pid
        echo 'server stopped!'
    fi
}

restart(){
    stop
    sleep 0.5
    echo '====='
    start
}

case "$ACTION" in
    start )
        start
        ;;
    start )
        start
        ;;
    start )
        start
        ;;
    *)
        usage
esac