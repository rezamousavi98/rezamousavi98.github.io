# Mohammad Reza Mousavi — Portfolio

A static portfolio with a TypeScript profile, selected projects, expertise, and contact links. No build step or package installation is required.

## Preview

Open `index.html`, or serve this folder locally:

```sh
python3 -m http.server 8080
```

Then visit `http://localhost:8080`. Clipboard actions work on localhost and HTTPS; selection or an email message is provided if clipboard access is unavailable.

## Editing

- `index.html`: biography, profile code, expertise, contact details, and metadata.
- `assets/projects.js`: project titles, descriptions, technologies, roles, and repository URLs. Personal projects appear first.
- `assets/styles.css`: theme tokens, components, responsive layouts, reduced-motion rules, and print styles.
- `assets/app.js`: rendering, theme persistence, navigation, clipboard actions, and the sorting preview.

Dark mode is the default. A saved light-mode preference is respected. The header gains a background after scrolling. Company cards have no images or ownership labels; Algorithm Lab retains its personal badge and repository link.

The sorting preview runs only after Play or Step is pressed. It pauses when hidden or scrolled out of view. Reduced-motion preferences disable transitions and the green availability flash.

Deploy the folder as a static site, preserving the `assets/` directory. Fonts load from Google Fonts with local fallbacks.
