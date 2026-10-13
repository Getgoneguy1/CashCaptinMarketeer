import os
import json

def test_build_artifacts():
    print("=== Running Search Box Affiliate Engine Integration Tests ===")
    
    # 1. Verify offers.json exists
    if not os.path.exists("offers.json"):
        print("[FAIL] offers.json missing from root directory.")
        return
    
    with open("offers.json", "r") as f:
        offers = json.load(f)
    print(f"[PASS] Loaded {len(offers)} offer(s) from offers.json.")

    # 2. Verify output directory and manifest exist
    manifest_path = os.path.join("output", "manifest.json")
    if not os.path.exists(manifest_path):
        print("[FAIL] output/manifest.json not found. Run main.py first.")
        return
    print("[PASS] Master manifest found.")

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    # 3. Verify Root Portal Index
    root_portal = os.path.join("output", "index.html")
    if os.path.exists(root_portal):
        print(f"[PASS] Root portal homepage verified: {root_portal}")
    else:
        print(f"[FAIL] Root portal homepage missing: {root_portal}")

    # 4. Verify individual offer hubs and tool pages
    for item in manifest:
        p_name = item.get("product_name")
        hub_path = item.get("hub_path")
        
        if os.path.exists(hub_path):
            print(f"  [PASS] Hub verified for '{p_name}': {hub_path}")
        else:
            print(f"  [FAIL] Missing hub for '{p_name}': {hub_path}")

    print("=== Integration Tests Complete ===")

if __name__ == "__main__":
    test_build_artifacts()
