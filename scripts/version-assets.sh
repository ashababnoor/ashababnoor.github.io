#!/usr/bin/env bash
# Adds ?v=<content hash> to local CSS and JS URLs so caches fetch new files after a deploy.
# The deploy workflow runs it on a throwaway checkout; run locally, it rewrites your files.
set -euo pipefail
cd "$(dirname "$0")/.."

assets=$(git ls-files '*.css' '*.js')
pages=$(git ls-files '*.html')

# Existing stamps are ignored, so a second run gives the same version.
version=$(cat $assets | perl -pe 's/\?v=[0-9a-f]+//g' | git hash-object --stdin | cut -c1-10)
export version

local_url='(?![a-z][a-z0-9+.-]*:|//)'  # skips https:, data: and //cdn URLs

perl -pi -e "s{((?:href|src)=\"$local_url[^\"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?\"}{\$1?v=\$ENV{version}\"}g" $pages
perl -pi -e "s{(\@import\s+url\(([\"']?)$local_url[^\"'?#)]+\.css)(?:\?v=[0-9a-f]+)?(\2\))}{\$1?v=\$ENV{version}\$3}g" $assets

# Fail loudly rather than deploy unversioned URLs if the patterns stop matching.
grep -qF "style.css?v=$version" index.html || { echo "version-assets: index.html was not stamped" >&2; exit 1; }
echo "Asset version: $version"
