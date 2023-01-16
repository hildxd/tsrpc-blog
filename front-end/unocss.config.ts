import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  rules: [
    // 多行文本超出部分省略号 line-n
    [
      /^line-(\d+)$/,
      ([, l]) => {
        if (~~l === 1) {
          return {
            overflow: "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap",
            width: "100%",
          };
        }
        return {
          overflow: "hidden",
          display: "-webkit-box",
          "-webkit-box-orient": "vertical",
          "-webkit-line-clamp": l,
        };
      },
    ],
  ],
  shortcuts: [
    ["btn", ""],
    ["item-hover", ""],
    ["li_common", "cursor-pointer flex justify-between items-center h-7"],
    ["base-color", "bg-gray-100 dark:bg-#18181c dark:text-white text-black"],
  ],

  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
