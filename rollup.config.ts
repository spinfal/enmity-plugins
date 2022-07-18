import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import json from "@rollup/plugin-json";
import { writeFileSync } from "fs";
import { defineConfig } from "rollup";

const plugins = ["MessageSpoofer", "NoDelete", "HideBlockedMessages"];
export default () => {
  let readme = "# Marek's Enmity plugins\n\n";

  const configs = plugins.map((name) => {
    readme += `\n## ${name}\n[Compiled](https://raw.githubusercontent.com/notmarek/enmity-plugins/master/dist/${name}.js)\n\n[Source](https://github.com/notmarek/enmity-plugins/tree/master/${name})`;
    return defineConfig({
      input: `${name}/src/index.tsx`,
      output: [
        {
          file: `dist/${name}.js`,
          format: "cjs",
          strict: false,
        },
      ],
      plugins: [
        nodeResolve(),
        commonjs(),
        json(),
        esbuild({ minify: true, target: "ES2019" }),
      ],
    });
  });
  writeFileSync("README.md", readme);
  return configs;
};
