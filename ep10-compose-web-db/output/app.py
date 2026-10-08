import socket
from http.server import BaseHTTPRequestHandler, HTTPServer

def count_visit():
    s = socket.create_connection(("db", 6379))
    s.sendall(b"INCR visits\r\n")
    reply = s.recv(64).decode().strip()
    s.close()
    return reply.lstrip(":")

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = f"Visits: {count_visit()}\n".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(body)

HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
