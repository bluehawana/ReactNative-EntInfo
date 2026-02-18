#!/bin/bash

# Check "2watch" app name availability across key App Store locales
# Usage: ./check_app_name.sh

APP_NAME="2watch"
ALT_NAMES=("2watch" "2 watch" "2-watch" "twowatch" "two watch")

# Key countries: US, UK, Canada, Australia, EU major markets
COUNTRIES=("us" "gb" "ca" "au" "de" "fr" "jp" "kr" "br" "mx" "in" "sg")

echo "======================================"
echo "App Name Availability Check for: $APP_NAME"
echo "======================================"
echo ""

for name in "${ALT_NAMES[@]}"; do
  echo "Checking variations: '$name'"
  echo "--------------------------------------"

  for country in "${COUNTRIES[@]}"; do
    # Encode the search term for URL
    encoded_name=$(echo "$name" | sed 's/ /%20/g')

    # Call iTunes Search API
    response=$(curl -s "https://itunes.apple.com/search?term=${encoded_name}&entity=software&country=${country}&limit=50")

    # Count results
    count=$(echo "$response" | grep -o '"trackName"' | wc -l | tr -d ' ')

    # Check for exact match
    exact_match=$(echo "$response" | grep -i "\"trackName\":\"$APP_NAME" || echo "")

    if [ -n "$exact_match" ]; then
      echo "  ❌ [$country] CONFLICT: Found exact match for '$name'"
      # Show the app name
      echo "$response" | grep -o '"trackName":"[^"]*"' | head -3 | sed 's/^/      /'
    elif [ "$count" -gt 0 ]; then
      echo "  ⚠️  [$country] $count similar apps found for '$name'"
      # Show first 2 similar apps
      echo "$response" | grep -o '"trackName":"[^"]*"' | head -2 | sed 's/^/      /'
    else
      echo "  ✅ [$country] No apps found - AVAILABLE"
    fi
  done
  echo ""
done

echo "======================================"
echo "Summary: Check complete!"
echo "======================================"
echo ""
echo "Note: Even if no exact match is found, Apple may still reject"
echo "names that are too similar to existing apps or trademarks."
echo ""
echo "Also check these resources:"
echo "- USPTO Trademark Search: https://uspto.gov/trademarks/search"
echo "- WIPO Global Brand Database: https://wipo.int/globalbrand/en/"
