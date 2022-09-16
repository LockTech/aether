# VSCode: Explorer File Nesting

VSCode (version `1.67` and later) supports [nesting files](https://code.visualstudio.com/updates/v1_67#_explorer-file-nesting), allowing you to drastically decrease the amount of configuration files cluttering your editor. The following should be appended to `.vscode/settings.json`.

```JSON
{
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    ".env.defaults": "*.env, .env.*, env.d.ts",
    ".gitignore": ".gitattributes, .gitmodules, .gitmessage, .mailmap, .git-blame*",
    "index.d.ts": "*.d.ts",
    "package.json": ".browserslist*, .circleci*, .codecov, .commitlint*, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitpod*, .huskyrc*, .jslint*, .lintstagedrc*, .markdownlint*, .mocha*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .releaserc*, .sentry*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .vscode*, .watchman*, .xo-config*, .yamllint*, .yarnrc*, api-extractor.json, apollo.config.*, appveyor*, ava.config.*, azure-pipelines*, bower.json, build.config.*, commitlint*, crowdin*, cypress.json, dangerfile*, docker-compose.yml, dprint.json, firebase.json, grunt*, gulp*, jasmine.*, jenkins*, jest.config.*, jsconfig.*, karma*, lerna*, lint-staged*, nest-cli.*, netlify*, nodemon*, nx.*, package-lock.json, playwright.config.*, pm2.*, pnpm*, prettier*, pullapprove*, puppeteer.config.*, renovate*, rollup.config.*, stylelint*, tsconfig.*, tsdoc.*, tslint*, tsup.config.*, turbo*, typedoc*, vercel*, vetur.config.*, vitest.config.*, webpack.config.*, workspace.json, xo.config.*, yarn*, graphql.config*, redwood.toml, server.config.js",
    "readme.*": "authors, backers.md, changelog*, citation*, code_of_conduct.md, codeowners, contributing.md, contributors, copying, credits, governance.md, history.md, license*, maintainers, readme*, security.md, sponsors.md",
    "storybook.config.js": "storybook.*.js",
    "App.*": "App.*, i18n.*, index.html",
  }
}
```
