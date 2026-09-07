#!/usr/bin/env python3
"""Submit this deploy's changed URLs to IndexNow.

Waits for Vercel to publish the new sitemap, reads the URLs whose <lastmod>
matches the target date, and pushes them. Exits 0 when there is nothing to
submit so a docs-only push does not fail the run.
"""
import datetime
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

HOST = "servefunding.com"
SITEMAP = f"https://{HOST}/sitemap.xml"
ENDPOINT = "https://api.indexnow.org/IndexNow"
KEY_FILE = "public/7f3a2b9c4d8e1f6a5b7c9d2e4f8a1b3c.txt"

# Vercel builds this site in a couple of minutes; give it a generous margin
# before concluding the deploy simply had no content changes in it.
POLL_SECONDS = 20
POLL_ATTEMPTS = 45

UA = {"User-Agent": "serve-funding-indexnow/1.0"}


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def urls_modified_on(sitemap_xml: str, date: str) -> list[str]:
    out = []
    for block in re.findall(r"<url>.*?</url>", sitemap_xml, re.S):
        loc = re.search(r"<loc>(.*?)</loc>", block)
        mod = re.search(r"<lastmod>(.*?)</lastmod>", block)
        if loc and mod and mod.group(1)[:10] == date:
            out.append(loc.group(1))
    return out


def main() -> int:
    date = os.environ.get("TARGET_DATE") or datetime.datetime.now(
        datetime.timezone.utc
    ).strftime("%Y-%m-%d")

    try:
        key = open(KEY_FILE).read().strip()
    except OSError as e:
        print(f"::error::cannot read IndexNow key at {KEY_FILE}: {e}")
        return 1

    urls: list[str] = []
    for attempt in range(1, POLL_ATTEMPTS + 1):
        try:
            urls = urls_modified_on(fetch(SITEMAP), date)
        except urllib.error.URLError as e:
            print(f"attempt {attempt}: sitemap fetch failed ({e}); retrying")
        else:
            if urls:
                break
            print(f"attempt {attempt}: no URLs with lastmod {date} yet; waiting for deploy")
        if attempt < POLL_ATTEMPTS:
            time.sleep(POLL_SECONDS)

    if not urls:
        print(f"No URLs changed on {date}. Nothing to submit.")
        return 0

    payload = {
        "host": HOST,
        "key": key,
        "keyLocation": f"https://{HOST}/{os.path.basename(KEY_FILE)}",
        "urlList": urls,
    }

    req = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode(),
        headers={**UA, "Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            status = r.status
    except urllib.error.HTTPError as e:
        # 422 usually means the key did not validate — worth failing loudly.
        print(f"::error::IndexNow rejected the submission: {e.code} {e.read().decode()[:400]}")
        return 1
    except urllib.error.URLError as e:
        print(f"::error::IndexNow unreachable: {e}")
        return 1

    print(f"Submitted {len(urls)} URL(s) with lastmod {date}; IndexNow returned {status}.")
    for u in urls:
        print(f"  {u}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
