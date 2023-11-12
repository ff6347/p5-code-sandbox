# P5 Code Sandbox

Small experiment to have a code sandbox for testing p5.js code. Based on [this blog](https://joyofcode.xyz/create-a-coding-sandbox) post "Create a JavaScript Code Sandbox" by Matija.
The idea is to be able to build a documentation page for sketches produced during seminars, like in my seminar [gestalten-in-code](https://interface.fh-potsdam.de/gestalten-in-code/) but have all the sketchs editable in the sandbox.

Current feature set is limited but it can:

- Save changes to local storage
- Control via component prop if changes should be saved to local storage
- Control via URL SearchParameters if the local storage should be disabled

See [@ff6347 p5js code sandbox project for planned features](https://github.com/users/ff6347/projects/2/views/1)

## Development

```bash
npm ci
npm run dev
```

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── sandbox.css // the components css
│   │   └── Sandbox.tsx // the component to load in pages
│   ├── hooks/
│   │   └── local-storage.ts // the local storage customHook
│   ├── hooks/
│   │   └── iframe-source.ts // the html for the iframe
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

## Astro Docs

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
