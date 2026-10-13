import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 8080
OFFERS_FILE = "offers.json"
TRACKING_FILE = "tracking.json"

class AdminHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        
        if parsed_url.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            self.wfile.write(self.get_html_page().encode("utf-8"))
        elif parsed_url.path == "/data":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            data = self.load_data()
            self.wfile.write(json.dumps(data).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        parsed_url = urlparse(self.path)
        if parsed_url.path == "/add":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = parse_qs(post_data)
            
            p_name = params.get("product_name", [""])[0].strip()
            p_desc = params.get("product_description", [""])[0].strip()
            aff_id = params.get("affiliate_id", ["DEFAULT_AFF"])[0].strip()

            if p_name and p_desc:
                offers = []
                if os.path.exists(OFFERS_FILE):
                    with open(OFFERS_FILE, "r") as f:
                        try:
                            offers = json.load(f)
                        except Exception:
                            offers = []
                
                offers.append({
                    "product_name": p_name,
                    "product_description": p_desc,
                    "affiliate_id": aff_id
                })

                with open(OFFERS_FILE, "w") as f:
                    json.dump(offers, f, indent=2)

            self.send_response(303)
            self.send_header("Location", "/")
            self.end_headers()

    def load_data(self):
        offers = []
        tracking = {"clicks": 0, "conversions": 0, "revenue": 0.0}
        if os.path.exists(OFFERS_FILE):
            with open(OFFERS_FILE, "r") as f:
                try: offers = json.load(f)
                except: pass
        if os.path.exists(TRACKING_FILE):
            with open(TRACKING_FILE, "r") as f:
                try: tracking = json.load(f)
                except: pass
        return {"offers": offers, "tracking": tracking}

    def get_html_page(self):
        return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Affiliate Engine Dashboard</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 1.5rem; margin: 0; }
        .container { max-width: 600px; margin: 0 auto; }
        .card { background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        input, textarea { width: 100%; padding: 10px; margin: 8px 0 15px 0; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: #fff; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
        button:hover { background: #2563eb; }
        .stats { display: flex; justify-content: space-between; text-align: center; }
        .stat-box { background: #0f172a; padding: 1rem; border-radius: 6px; width: 30%; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Affiliate Control Center</h1>
        <div class="card">
            <h2>Accounting & Tracking</h2>
            <div class="stats">
                <div class="stat-box"><h3 id="statClicks">0</h3><p>Clicks</p></div>
                <div class="stat-box"><h3 id="statConv">0</h3><p>Conversions</p></div>
                <div class="stat-box"><h3 id="statRev">$0.00</h3><p>Revenue</p></div>
            </div>
        </div>
        <div class="card">
            <h2>Add New Offer</h2>
            <form action="/add" method="POST">
                <label>Product Name:</label>
                <input type="text" name="product_name" required>
                <label>Description:</label>
                <textarea name="product_description" rows="3" required></textarea>
                <label>Affiliate ID / Tag:</label>
                <input type="text" name="affiliate_id" required>
                <button type="submit">Save Offer</button>
            </form>
        </div>
    </div>
    <script>
        fetch('/data').then(res => res.json()).then(data => {
            document.getElementById('statClicks').innerText = data.tracking.clicks;
            document.getElementById('statConv').innerText = data.tracking.conversions;
            document.getElementById('statRev').innerText = '$' + data.tracking.revenue.toFixed(2);
        });
    </script>
</body>
</html>"""

def run():
    server = HTTPServer(('127.0.0.1', PORT), AdminHandler)
    print(f"[+] Admin server running at http://127.0.0.1:{PORT}")
    server.serve_forever()

if __name__ == '__main__':
    run()
