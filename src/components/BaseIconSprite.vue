<template>
  <svg
    width="0"
    height="0"
    style="display: none;"
    v-html="$options.svgSprite"
  />
</template>

<script>
const svgContext = require.context(
  "!svg-inline-loader?" +
    "removeTags=true" +
    "&removeSVGTagAttrs=true" +
    "&removingTagAttrs=fill" +
    "!@/assets/icons",
  true,
  /\w+\.svg$/i
);
const symbols = svgContext
  ? svgContext.keys().map(path => {
      const content = svgContext(path);
      const id = path.replace(/^\.\/(.*)\.\w+$/, "$1");
      return content
        .replace("<svg", `<symbol id="${id}"`)
        .replace("svg>", "symbol>");
    })
  : [];
export default {
  svgSprite: symbols.join("\n")
};
</script>
