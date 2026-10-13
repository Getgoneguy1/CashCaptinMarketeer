import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 8081
TRACKING_FILE = "tracking.json"

class TrackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        
        if parsed_url.path == "/click":
            query_params = parse_qs(parsed_url.query)
            target_url = query_params.get("to", ["https://example.com"])[0]
            
            # Update tracking clicks
            self.record_click()

            # Redirect user to the actual affiliate destination
            self.send_response(302)
            self.send_header("Location", target_url)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()

    def record_click(self):
        tracking = {"clicks": 0, "conversions": 0, "revenue": 0.0}
        if os.path.exists(TRACKING_FILE):
            with open(TRACKING_FILE, "r") as f:
                try:
                    tracking = json.load(f)
                except Exception:
                    pass
        
        tracking["clicks"] += 1

        with open(TRACKING_FILE, "w") as f:
            json.dump(tracking, f, indent=2)
        print(f"[+] Click recorded! Total clicks: {tracking['clicks']}")

def run():
    server = HTTPServer(('127.0.0.1', PORT), TrackHandler)
    print(f"[+] Tracking redirect server running at http://127.0.0.1:{PORT}")
    server.serve_forever()

if __name__ == '__main__':
    run()
