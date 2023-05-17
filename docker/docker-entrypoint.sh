#!/bin/sh -eu


function generateConfigJs(){
    echo "<script>";
    for i in `env | grep '^REACT_APP'`
    do
        key=$(echo "$i" | cut -d"=" -f1);
        val=$(echo "$i" | cut -d"=" -f2);
        echo "window.${key}='${val}' ;";
    done
    echo "</script>";
}

#[ -f /app/build/index.html.origin ] || cp /app/build/index.html /app/build/index.html.origin
#content=$(cat /app/build/index.html.origin)
content=$(cat /app/build/index.html)
generateConfigJs > /app/build/index.html
echo "$content" >> /app/build/index.html

nginx -g "daemon off;"