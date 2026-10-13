import os
import json
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

PORT = 8080
OFFERS_FILE = "offers.json"
TRACKING_FILE = "tracking.json"
OUTPUT_DIR = "output"

class DashboardHandler(BaseHTTPRequestHandler):
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
        elif parsed_url.path == "/click":
            query_params = parse_qs(parsed_url.query)
            target_url = query_params.get("to", ["https://example.com"])[0]
            self.record_click()
            self.send_response(302)
            self.send_header("Location", target_url)
            self.end_headers()
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
                        try: offers = json.load(f)
                        except: offers = []
                
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
        elif parsed_url.path == "/update_metrics":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            params = parse_qs(post_data)
            
            try:
                conversions = int(params.get("conversions", [0])[0])
                revenue = float(params.get("revenue", [0.0])[0])
                
                tracking = {"clicks": 0, "conversions": 0, "revenue": 0.0}
                if os.path.exists(TRACKING_FILE):
                    with open(TRACKING_FILE, "r") as f:
                        try: tracking = json.load(f)
                        except: pass
                
                tracking["conversions"] = conversions
                tracking["revenue"] = revenue

                with open(TRACKING_FILE, "w") as f:
                    json.dump(tracking, f, indent=2)
            except Exception:
                pass

            self.send_response(303)
            self.send_header("Location", "/")
            self.end_headers()
        elif parsed_url.path == "/rebuild":
            try:
                subprocess.run(["python", "main.py"], check=True)
            except Exception as e:
                print(f"[-] Rebuild failed: {e}")
            
            self.send_response(303)
            self.send_header("Location", "/")
            self.end_headers()

    def record_click(self):
        tracking = {"clicks": 0, "conversions": 0, "revenue": 0.0}
        if os.path.exists(TRACKING_FILE):
            with open(TRACKING_FILE, "r") as f:
                try: tracking = json.load(f)
                except: pass
        tracking["clicks"] += 1
        with open(TRACKING_FILE, "w") as f:
            json.dump(tracking, f, indent=2)

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
        
        # Load generated platform copy for active offers if available
        enriched_offers = []
        for offer in offers:
            p_name = offer.get("product_name")
            slug = p_name.lower().replace(" ", "_") if p_name else ""
            copy_path = os.path.join(OUTPUT_DIR, slug, "platform_copy.json")
            platform_copy = {}
            if os.path.exists(copy_path):
                with open(copy_path, "r") as f:
                    try: platform_copy = json.load(f)
                    except: pass
            
            offer_data = dict(offer)
            offer_data["platform_copy"] = platform_copy
            enriched_offers.append(offer_data)

        return {"offers": enriched_offers, "tracking": tracking}

    def get_html_page(self):
        return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Box Affiliate Engine - Control Center</title>
    <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 1.5rem; margin: 0; }
        .container { max-width: 700px; margin: 0 auto; }
        .card { background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
        input, textarea { width: 100%; padding: 10px; margin: 8px 0 15px 0; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: #fff; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
        button:hover { background: #2563eb; }
        .btn-green { background: #10b981; margin-top: 10px; }
        .btn-green:hover { background: #059669; }
        .stats { display: flex; justify-content: space-between; text-align: center; gap: 10px; }
        .stat-box { background: #0f172a; padding: 1rem; border-radius: 6px; flex: 1; }
        .offer-item { border-bottom: 1px solid #334155; padding-bottom: 15px; margin-bottom: 15px; }
        pre { background: #0f172a; padding: 10px; border-radius: 6px; overflow-x: auto; font-size: 13px; color: #38bdf8; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Search Box Engine</h1>
        
        <div class="card">
            <h2>Pipeline & Deployment</h2>
            <form action="/rebuild" method="POST">
                <button type="submit" class="btn-green">Rebuild All Search Tools & Hubs</button>
            </form>
        </div>

        <div class="card">
            <h2>Accounting & Performance</h2>
            <div class="stats">
                <div class="stat-box"><h3 id="statClicks">0</h3><p>Clicks</p></div>
                <div class="stat-box"><h3 id="statConv">0</h3><p>Conversions</p></div>
                <div class="stat-box"><h3 id="statRev">$0.00</h3><p>Revenue</p></div>
            </div>
            <form action="/update_metrics" method="POST" style="margin-top: 15px;">
                <label>Update Conversions:</label>
                <input type="number" name="conversions" id="inputConv" value="0">
                <label>Update Total Revenue ($):</label>
                <input type="number" step="0.01" name="revenue" id="inputRev" value="0.00">
                <button type="submit">Save Accounting Data</button>
            </form>
        </div>

        <div class="card">
            <h2>Add New Affiliate Offer</h2>
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

        <div class="card">
            <h2>Active Offers & AI Platform Assets</h2>
            <div id="offersList"><p>Loading offers...</p></div>
        </div>
    </div>
    <script>
        fetch('/data').then(res => res.json()).then(data => {
            document.getElementById('statClicks').innerText = data.tracking.clicks;
            document.getElementById('statConv').innerText = data.tracking.conversions;
            document.getElementById('statRev').innerText = '$' + data.tracking.revenue.toFixed(2);
            document.getElementById('inputConv').value = data.tracking.conversions;
            document.getElementById('inputRev').value = data.tracking.revenue;

            const listContainer = document.getElementById('offersList');
            if(data.offers.length === 0) {
                listContainer.innerHTML = '<p>No offers found in offers.json</p>';
            } else {
                let html = '';
                data.offers.forEach(o => {
                    html += `<div class="offer-item">
                        <h3>${o.product_name}</h3>
                        <p><small>${o.product_description}</small></p>
                        <code>Tag: ${o.affiliate_id}</code>
                        <h4>AI Platform Copy & Strategy:</h4>
                        <pre>${JSON.stringify(o.platform_copy, null, 2)}</pre>
                    </div>`;
                });
                listContainer.innerHTML = html;
            }
        });
    </script>
</body>
</html>"""

def run():
    server = HTTPServer(('127.0.0.1', PORT), DashboardHandler)
    print(f"[+] Master Dashboard running at http://127.0.0.1:{PORT}")
    server.serve_forever()

if __name__ == '__main__':
    run()
    