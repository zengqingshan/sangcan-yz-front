FROM nginx:latest
COPY certification.conf /etc/nginx/conf.d
COPY ssl.pem /etc/nginx/conf.d
COPY ssl.key /etc/nginx/conf.d
COPY 6031965_huiyan.jxict.cn.pem /etc/nginx/conf.d
COPY 6031965_huiyan.jxict.cn.key /etc/nginx/conf.d
COPY /dist /etc/nginx/html/dist
RUN chmod -R 777 /etc/nginx/html
EXPOSE 12346
