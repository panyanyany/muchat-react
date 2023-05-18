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

# 其实不保存成 origin 也可以，docker compose 会判断环境变量有没有改过，有的话会初始化 container
[ -f /app/build/index.html.origin ] || cp /app/build/index.html /app/build/index.html.origin
content=$(cat /app/build/index.html.origin)
#content=$(cat /app/build/index.html)
generateConfigJs > /app/build/index.html
echo "$content" >> /app/build/index.html

cp /app/docker/default.conf /etc/nginx/conf.d/default.conf
nginx -g "daemon off;"