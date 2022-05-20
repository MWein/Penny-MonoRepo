FROM nginx:alpine

# Uncomment error page
RUN sed -i -e 's/#error_page/error_page/g' /etc/nginx/conf.d/default.conf

# Change error page to index.html
RUN sed -i -e 's/404.html/index.html/g' /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY ./bundle/ ./