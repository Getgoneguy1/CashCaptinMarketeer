import json
import os

def add_new_offer():
    print("=== Add New Affiliate Offer ===")
    product_name = input("Enter Product Name: ").strip()
    product_description = input("Enter Product Description: ").strip()
    affiliate_id = input("Enter Affiliate ID / Tag: ").strip()

    if not product_name or not product_description:
        print("[-] Error: Product name and description cannot be empty.")
        return

    offers_file = "offers.json"
    offers = []
    if os.path.exists(offers_file):
        with open(offers_file, "r") as f:
            try:
                offers = json.load(f)
            except Exception:
                offers = []

    new_offer = {
        "product_name": product_name,
        "product_description": product_description,
        "affiliate_id": affiliate_id or "DEFAULT_AFF"
    }

    offers.append(new_offer)

    with open(offers_file, "w") as f:
        json.dump(offers, f, indent=2)

    print(f"[+] Successfully added '{product_name}' to {offers_file}!")

if __name__ == "__main__":
    add_new_offer()
