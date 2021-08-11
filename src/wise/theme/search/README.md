## Wise Catalog of Measures


This application  uses the EEA Semantic Search library.

To test it, run:

```
git clone https://github.com/eea/searchlib
cd searchlib
pnpm m build
```

Then, inside this folder:

```
pnpm link ../path/to/searchlib/packages/searchlib
pnpm link ../path/to/searchlib/packages/searchlib-less
pnpm build
```

Then create a new folder, set the layout to [@@measures-search](http://localhost:8080/Plone/@@measures-search)

There are 3 different modes to run the app:

- `pnpm run watch` builds the index.html and resources to develop and use the page in Plone
- `pnpm run build` static builds the index.html and resources for final use in Plone
- `pnpm run start` runs a live development server, outside of Plone. Use [localhost:3000](http://localhost:3000) for quickest development path.
