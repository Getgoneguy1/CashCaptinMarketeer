import os
import json
from google import genai

client = genai.Client()

def analyze_and_target_platforms(product_name: str, product_description: str):
    prompt = f"""
    You are an expert affiliate marketing strategist. 
    Analyze the following product and:
    1. Identify the best 3-4 target platforms (e.g., Reddit, Facebook Groups, Quora, Twitter/X, Medium) where this product converts best organically.
    2. For each platform, generate compliance-safe promotional content designed to avoid getting flagged or banned:
       - For Reddit: A natural, helpful community comment/reply response containing context and value.
       - For Facebook: An engaging post description paired with an image visual concept and hook.
       - For Quora/Blog: A detailed answer or short-form article intro.
    3. Generate 5 high-intent keywords and 5 pain-point buyer questions.

    Product Name: {product_name}
    Description: {product_description}

    Return the output strictly as a JSON object with keys: 
    - "target_platforms" (array of strings)
    - "keywords" (array of strings)
    - "questions" (array of strings)
    - "platform_copy" (object mapping platform name to generated copy and strategy)
    - "micro_search_tools" (array of 3 objects with "tool_title", "search_box_placeholder", "target_intent", "deep_link_base_url")
    """
    response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
    try:
        return json.loads(response.text)
    except Exception:
        cleaned = response.text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)

def generate_search_tool_html(tool_concept: dict, affiliate_id: str):
    title = tool_concept.get("tool_title", "Quick Search Tool")
    placeholder = tool_concept.get("search_box_placeholder", "Enter search query...")
    base_url = tool_concept.get("deep_link_base_url", "https://www.example.com/search?q=")
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }}
        .card {{ background: #1e293b; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.5); width: 100%; max-width: 450px; text-align: center; }}
        input {{ width: 100%; padding: 12px; margin: 15px 0; border: 1px solid #475569; border-radius: 6px; background: #0f172a; color: #fff; font-size: 16px; box-sizing: border-box; }}
        button {{ width: 100%; padding: 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; }}
        button:hover {{ background: #2563eb; }}
    </style>
</head>
<body>
    <div class="card">
        <h2>{title}</h2>
        <input type="text" id="userQuery" placeholder="{placeholder}" />
        <button onclick="executeDeepSearch()">Search & Access</button>
    </div>
    <script>
        function executeDeepSearch() {{
            const query = encodeURIComponent(document.getElementById('userQuery').value);
            if (!query) {{ alert('Please enter a search term.'); return; }}
            const affiliateId = "{affiliate_id}";
            const targetUrl = `{base_url}${{query}}&aff_id=${{affiliateId}}`;
            window.location.href = targetUrl;
        }}
    </script>
</body>
</html>"""

def generate_index_html(product_name: str, tools: list):
    list_items = ""
    for idx, tool in enumerate(tools, start=1):
        t_title = tool.get("tool_title", f"Tool {idx}")
        t_intent = tool.get("target_intent", "")
        list_items += f"""
        <div class="tool-card">
            <h3><a href="tool_{idx}.html">{t_title}</a></h3>
            <p>{t_intent}</p>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product_name} - Search Tools Hub</title>
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; }}
        h1 {{ text-align: center; margin-bottom: 2rem; }}
        .tool-card {{ background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }}
        .tool-card h3 {{ margin-top: 0; }}
        .tool-card a {{ color: #3b82f6; text-decoration: none; }}
        .tool-card a:hover {{ text-decoration: underline; }}
        .tool-card p {{ color: #94a3b8; font-size: 14px; margin-bottom: 0; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{product_name} Hub</h1>
        {list_items}
    </div>
</body>
</html>"""

def generate_master_manifest(offers_data: list):
    manifest = []
    for offer in offers_data:
        p_name = offer.get("product_name", "Unknown Offer")
        slug = p_name.lower().replace(" ", "_")
        manifest.append({
            "product_name": p_name,
            "hub_path": f"output/{slug}/index.html"
        })
    
    manifest_path = os.path.join("output", "manifest.json")
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    
    root_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Box Affiliate Directory</title>
    <style>
        body {{ font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; }}
        h1 {{ text-align: center; margin-bottom: 2rem; }}
        .offer-card {{ background: #1e293b; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }}
        .offer-card h3 {{ margin-top: 0; }}
        .offer-card a {{ color: #3b82f6; text-decoration: none; font-size: 18px; font-weight: bold; }}
        .offer-card a:hover {{ text-decoration: underline; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Affiliate Search Tools Directory</h1>
"""
    for item in manifest:
        rel_hub = item["hub_path"].replace("output/", "")
        root_html += f"""
        <div class="offer-card">
            <h3><a href="{rel_hub}">{item["product_name"]}</a></h3>
        </div>
        """
    root_html += """
    </div>
</body>
</html>
"""
    root_index_path = os.path.join("output", "index.html")
    with open(root_index_path, "w") as f:
        f.write(root_html)
    print(f"\n[+] Generated Root Portal Homepage: {root_index_path}")

def run_batch_pipeline():
    if not os.path.exists("offers.json"):
        print("[-] Error: 'offers.json' not found in root directory.")
        return

    with open("offers.json", "r") as f:
        offers = json.load(f)

    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)

    print(f"=== Starting Batch Pipeline with Multi-Platform AI Generation for {len(offers)} offer(s) ===")

    for item_idx, offer in enumerate(offers, start=1):
        p_name = offer.get("product_name", f"Offer_{item_idx}")
        p_desc = offer.get("product_description", "")
        aff_id = offer.get("affiliate_id", "DEFAULT_AFF")

        print(f"\n[+] Processing Offer {item_idx}: {p_name}")
        
        ai_data = analyze_and_target_platforms(p_name, p_desc)
        gaps = ai_data.get("micro_search_tools", [])
        platform_copy = ai_data.get("platform_copy", {})

        slug = p_name.lower().replace(" ", "_")
        offer_dir = os.path.join(output_dir, slug)
        os.makedirs(offer_dir, exist_ok=True)

        # Save AI generated platform marketing assets
        copy_filename = os.path.join(offer_dir, "platform_copy.json")
        with open(copy_filename, "w") as copy_f:
            json.dump(platform_copy, copy_f, indent=2)
        print(f"    └─ Generated Platform Content & Strategies: {copy_filename}")

        for tool_idx, tool_concept in enumerate(gaps, start=1):
            html_content = generate_search_tool_html(tool_concept, aff_id)
            filename = os.path.join(offer_dir, f"tool_{tool_idx}.html")
            with open(filename, "w") as out_f:
                out_f.write(html_content)
            print(f"    └─ Generated Tool: {filename}")

        index_content = generate_index_html(p_name, gaps)
        index_filename = os.path.join(offer_dir, "index.html")
        with open(index_filename, "w") as idx_f:
            idx_f.write(index_content)
        print(f"    └─ Generated Hub Index: {index_filename}")

    generate_master_manifest(offers)
    print("\n=== Batch Pipeline Complete ===")

if __name__ == "__main__":
    run_batch_pipeline()
