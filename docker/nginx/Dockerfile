FROM nginx:1.27-alpine

# Xóa cấu hình mặc định cũ của Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Sao chép cấu hình Reverse Proxy của SpeakUp vào
COPY default.conf /etc/nginx/conf.d/default.conf

# Mở cổng 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
