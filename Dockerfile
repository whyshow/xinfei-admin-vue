#dockerfile
#使用 nginx最新版本作为基础镜像
FROM nginx

#将当前文件夹的dist文件复制到容器的/usr/share/nginx/html目录
COPY ./dist/ /usr/share/nginx/html/

COPY default.conf /etc/nginx/conf.d/default.conf


