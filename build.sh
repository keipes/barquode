#!/usr/bin/env sh

# bail on first error
set -e

rm -rf build

mkdir -p build/js
#tsc src/inline.ts --outFile build/js/inline.js
tsc -p tsconfig.json
mkdir build/uglified
uglifyjs build/js/inline.js -o build/uglified/inline.js --compress --mangle
mkdir build/tersered
terser --compress --mangle -o build/tersered/inline.js -- build/js/inline.js

mkdir build/template
template="src/index-template.html"
replaceme="inlinescriptgoeshere"
templatizedindex="build/template/index.html"

#numlines="$(cat ${template} | wc -l)"
#grep -B "${numlines}" "${replaceme}" src/index-template.html | grep -v "${replaceme}" > "${templatizedindex}"
#cat build/uglified/inline.js >> "${templatizedindex}"
#echo "" >> "${templatizedindex}"
#grep -A "${numlines}" "${replaceme}" src/index-template.html | grep -v "${replaceme}" >> "${templatizedindex}"

while IFS="" read -r p || [ -n "$p" ]
do
  if [[ "$p" =~ inlinestylesgohere ]]
  then
    cat src/inline.css >> "${templatizedindex}"
  elif [[ "$p" =~ inlinescriptgoeshere ]]
  then
    cat build/uglified/inline.js >> "${templatizedindex}"
  else
    printf '%s\n' "$p" >> "${templatizedindex}"
  fi
#    echo $line; fi
done < "${template}"


mkdir build/web
webindex="build/web/index.html"
html-minifier --collapse-whitespace --remove-comments --remove-optional-tags --remove-redundant-attributes --remove-script-type-attributes --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true "${templatizedindex}" -o "${webindex}"



#mkdir build/web
#js="$(cat build/uglified/inline.js)"
#sed "s/inlinescriptgoeshere/${js}/" src/index-template.html > build/web/index.html
#


