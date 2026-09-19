FROM nginx:alpine

# Serve /page as page.html, like GitHub Pages does
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri.html $uri/ =404;
    }
}
EOF

# Only the site itself (no scripts, git metadata, etc.)
COPY *.html /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets

EXPOSE 80
