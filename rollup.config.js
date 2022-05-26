import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import dedent from "dedent";

const XHR2_COOKIES = 'xhr2-cookies';

export default {
    input: './index.js',
    plugins: [
        {
            name: `kill-${XHR2_COOKIES}`,
            resolveId(source) {
                // if (source === 'web3-provider-engine') {
                //     debugger;
                // }
                if (source === XHR2_COOKIES) {
                    return source;
                }
            },
            load(id) {
                if (id === XHR2_COOKIES) {
                    return dedent`export class XMLHttpRequest {
                        constructor() {
                            throw new Error(
                                "This '@walletconnect/web3-provider' is dedicated to browsers " +
                                "and it requires a global 'XMLHttpRequest' object."
                            );
                        }
                    }`;
                }
            }
        },
        nodeResolve({
            browser: true,
            preferBuiltins: false,
        }),
        commonjs({
            transformMixedEsModules: true,
        }),
        json(),
    ],
    output: {
        format: 'esm',
        file: './lib/index.mjs',
    },
};