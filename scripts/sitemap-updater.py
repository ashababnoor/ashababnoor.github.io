import subprocess
import xml.etree.ElementTree as ET
from datetime import datetime
import os

# Configurations
PATHS_TO_CHECK = [
    "index.html",
]

PATH_TO_URL = {
    "index.html": "https://ashababnoor.github.io/",
}

RESOURCE_PATHS_TO_WATCH = [
    "style.css",
    "script.js",
    "scss/",
]

SITEMAP_FILE = "sitemap.xml"
NUM_COMMITS_TO_CHECK = 10
DEFAULT_PRIORITY = "1.0"


def path_exists(path):
    return os.path.exists(path)


def get_recent_commit_dates(path, num_commits=NUM_COMMITS_TO_CHECK):
    if not path_exists(path):
        return []
    try:
        output = subprocess.check_output(
            ["git", "log", f"-n{num_commits}", "--format=%cI", "--", path],
            stderr=subprocess.DEVNULL
        ).decode().strip()
        if not output:
            return []
        lines = output.splitlines()
        dates = [datetime.fromisoformat(line.rstrip("Z")) for line in lines if line]
        return dates
    except subprocess.CalledProcessError:
        return []


def decide_changefreq(days_diff):
    if days_diff <= 1:
        return "hourly"
    elif days_diff <= 7:
        return "daily"
    elif days_diff <= 30:
        return "weekly"
    else:
        return "monthly"


def estimate_changefreq(commit_dates):
    if not commit_dates:
        return "monthly", None
    if len(commit_dates) == 1:
        days_since = (datetime.utcnow() - commit_dates[0]).days
        return decide_changefreq(days_since), commit_dates[0]

    diffs = []
    for i in range(len(commit_dates) - 1):
        diff = (commit_dates[i] - commit_dates[i + 1]).total_seconds()
        if diff > 0:
            diffs.append(diff)

    if not diffs:
        return "monthly", commit_dates[0]

    avg_diff_days = (sum(diffs) / len(diffs)) / 86400
    return decide_changefreq(avg_diff_days), commit_dates[0]


def load_existing_sitemap(file):
    if not os.path.exists(file):
        return None
    try:
        tree = ET.parse(file)
        return tree
    except Exception:
        return None


def indent(elem, level=0):
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        for e in elem:
            indent(e, level+1)
        if not e.tail or not e.tail.strip():
            e.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i


def write_pretty_xml(tree, filename):
    indent(tree.getroot())
    tree.write(filename, encoding="UTF-8", xml_declaration=True)


def find_url_element(root, url, ns_uri):
    """
    Find an existing <url> element by its <loc> text.
    """
    for url_elem in root.findall(f"{{{ns_uri}}}url"):
        loc_elem = url_elem.find(f"{{{ns_uri}}}loc")
        if loc_elem is not None and loc_elem.text == url:
            return url_elem
    return None


def update_sitemap():
    ns_uri = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", ns_uri)

    tree = load_existing_sitemap(SITEMAP_FILE)
    if tree:
        root = tree.getroot()
    else:
        root = ET.Element("urlset", xmlns=ns_uri)

    for path in PATHS_TO_CHECK:
        url = PATH_TO_URL.get(path)
        if not url:
            print(f"⚠️ No URL mapped for path '{path}', skipping.")
            continue

        html_commit_dates = get_recent_commit_dates(path)

        latest_resource_date = None
        for resource in RESOURCE_PATHS_TO_WATCH:
            resource_dates = get_recent_commit_dates(resource)
            if resource_dates:
                candidate = resource_dates[0]
                if not latest_resource_date or candidate > latest_resource_date:
                    latest_resource_date = candidate

        all_dates = []
        if html_commit_dates:
            all_dates.extend(html_commit_dates)
        if latest_resource_date:
            all_dates.append(latest_resource_date)

        if not all_dates:
            print(f"ℹ️ No commits found for '{path}' or its resources, assuming low change frequency.")
            changefreq, lastmod = "monthly", None
        else:
            all_dates.sort(reverse=True)
            changefreq, _ = estimate_changefreq(all_dates)
            lastmod = all_dates[0]

        if lastmod:
            if changefreq == "hourly":
                lastmod_str = lastmod.strftime("%Y-%m-%dT%H:%M:%S+00:00")
            else:
                lastmod_str = lastmod.strftime("%Y-%m-%d")
        else:
            lastmod_str = ""

        url_elem = find_url_element(root, url, ns_uri)

        if url_elem is not None:
            # update existing
            lm_elem = url_elem.find(f"{{{ns_uri}}}lastmod")
            if lm_elem is None:
                lm_elem = ET.SubElement(url_elem, "lastmod")
            lm_elem.text = lastmod_str

            cf_elem = url_elem.find(f"{{{ns_uri}}}changefreq")
            if cf_elem is None:
                cf_elem = ET.SubElement(url_elem, "changefreq")
            cf_elem.text = changefreq

            print(f"🔄 Updated {path} → changefreq: {changefreq}, lastmod: {lastmod_str or 'N/A'}")
        else:
            # create new
            url_elem = ET.SubElement(root, "url")
            loc = ET.SubElement(url_elem, "loc")
            loc.text = url

            lastmod_elem = ET.SubElement(url_elem, "lastmod")
            lastmod_elem.text = lastmod_str

            changefreq_elem = ET.SubElement(url_elem, "changefreq")
            changefreq_elem.text = changefreq

            priority_elem = ET.SubElement(url_elem, "priority")
            priority_elem.text = DEFAULT_PRIORITY

            print(f"✅ Added {path} → changefreq: {changefreq}, lastmod: {lastmod_str or 'N/A'}")

    tree = ET.ElementTree(root)
    write_pretty_xml(tree, SITEMAP_FILE)
    print(f"📄 Sitemap written to `{SITEMAP_FILE}`")


if __name__ == "__main__":
    update_sitemap()
