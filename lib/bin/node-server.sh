#!/bin/sh

#HOME=$(cd "$(dirname "$0")"; pwd)
ACTION=$1
PIDFILE="../server.pid"

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
    pid=`get_pid`

    if [ ! -z $pid ]; then
        echo 'server is already running'
    else
        msg_running = 'server is running ...'
        echo $msg_running
        #cd ../server
        cd ../
        echo $msg_running
        npm install
        echo $msg_running
        node ./bin/create-package.js
        echo $msg_running
        npm install
        echo $msg_running
        npm update
        echo $msg_running
        #cd ../bin
        cd ./bin > /dev/null 
        echo $msg_running
        nohup node ./run-server.js -m dev > /dev/null &
        echo $msg_running
        echo $! > $PIDFILE
        echo $pid
        echo 'server is run!'
    fi
}

#stop server
stop(){
    pid=`get_pid`
    if [ -z $pid ]; then
        echo 'server not running'
    else
        echo 'server is stopping ...'
        echo $pid
        kill -15 $pid
        rm $PIDFILE
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
    stop )
        stop
        ;;
    restart )
        restart
        ;;
    *)
        usage
esac