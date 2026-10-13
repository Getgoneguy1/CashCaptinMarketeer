import os
import json

def verify_output():
    manifest_path = os.path.join("output", "manifest.json")
    if not os.path.exists(manifest_path):
        print("[-] Verification Failed: output/manifest.json not found.")
        return

    with open(manifest_path, "r") as f:
        manifest = json.load(f)

    print(f"[+] Verifying {len(manifest)} offer hub(s) from manifest...")

    for item in manifest:
        p_name = item.get("product_name")
        hub_path = item.get("hub_path")
        
        if os.path.exists(hub_path):
            print(f"    [OK] Hub verified for '{p_name}': {hub_path}")
        else:
            print(f"    [FAIL] Missing hub for '{p_name}': {hub_path}")

    print("=== Build Verification Complete ===")

if __name__ == "__main__":
    verify_output()
