# CakeCart

Your cheesecake recipes, ingredient prices, cake pricing and shopping list in one installable app.

- **Cakes:** pick what you're baking → combined shopping list priced by the whole packages you buy.
- **Recipes:** cost, suggested price, profit and price per slice; edit markup, packaging and slices; add, edit and delete recipes.
- **Ingredients:** your store prices and package sizes, plus what you already have at home.
- **Settings (gear):** save a backup file, restore it on another phone, or reset to the original data.

Install on Android: open the site in Chrome → menu → **Install app**. On iPhone: Safari → Share → **Add to Home Screen**. Works offline after the first visit.

Your edits are saved on each device. `defaults.js` holds the built-in starting data; new built-in recipes added there are merged into existing installs without overwriting edits. Bump `VERSION` in `sw.js` on every change so installed copies update.
