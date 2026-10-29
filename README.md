# Dai-Bhai Brawl Stars Challenge

A playful, responsive invitation page made with plain HTML, CSS, and JavaScript. It uses original CSS styling and system emoji rather than Brawl Stars artwork, and it has no tracking, accounts, API calls, or audio.

## Preview it on your computer

1. Keep `index.html`, `style.css`, and `script.js` together in this folder.
2. Open `index.html` in a recent browser such as Chrome, Edge, Firefox, or Safari. The page works directly from the file; no Python server or package installation is needed.
3. Press the green YES button to see the celebration. Try hovering over the red NO button with a mouse or tapping it on a phone. Choose **RUN IT BACK?** to return.

## Publish it free (you stay in control)

You can publish these files yourself with a free static hosting service. Nothing is published by this project.

### GitHub Pages

1. Sign in to GitHub and create a **public** repository for the site.
2. Upload `index.html`, `style.css`, and `script.js` to the repository's top level. You may include this README too.
3. In the repository, open **Settings → Pages**. Select **Deploy from a branch**, choose the `main` branch and `/ (root)`, then save.
4. After GitHub finishes publishing, it will show the website URL in the Pages settings. Open that URL on your phone to check it, then send it to your brother through WhatsApp.

Alternatively, a static host such as Cloudflare Pages or Netlify can publish the same three files using its free plan. Follow that provider's current instructions; a public URL is only created after you choose to publish.

## What each file does

- **`index.html`** is the page's structure and the text you see. Change the invitation, headings, or button labels here.
- **`style.css`** controls the colors, layout, responsive sizing, button styles, and animations. It includes a reduced-motion option for people who prefer fewer animations.
- **`script.js`** makes the buttons interactive. It moves the NO button around the screen when a pointer or finger approaches, counts dodging attempts, swaps to the celebration screen when YES is pressed, creates the confetti, and lets **RUN IT BACK?** reset the page.
- **`README.md`** is this guide to previewing, publishing, and understanding the project.

JavaScript is the browser language that responds to events. For example, `addEventListener("click", ...)` tells the browser which function to run when someone clicks a button. `Math.random()` chooses confetti colors and safe positions for the dodging button.
