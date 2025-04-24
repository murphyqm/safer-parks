# Safer Parks Project
Work on the Safer Parks project.

This repository contains the source code for a tempalte web-app to be used for the Safer Parks project. This web-app is still a work-in-progress/draft. You can see the prototyping behind-the-scenes over at my [Static App Experimentation repo](https://github.com/murphyqm/static-app-experiments).

## Requirements (from a purely technical standpoint):

- Open, open-source
- Static framework that doesn't require a server - as cheap as possible
- Extensible
  - While we are focusing on a specific location, the tool sould be useable for other geographic regions.

## Framework

This webapp is built using a combination of HTML, CSS, JavaScript, and Markdown.

- In order to make it developer/researcher friendly in terms of building the app, rich text etc. can be edited in markdown, with snippets of HTML included when needed. 
- [Quarto](https://quarto.org/) is used to render the overall project, with custom theming etc. This uses `.qmd` and `.md` files.
- The project is currently build locally and then the HTML files pushed to GitHub; in the future we can change this to have the build run via an action.

## Folder organisation

This is a relatively simple webapp, but even so contains a number of different files and folders to keep track of. In order to ensure a clean division of written content (`.qmd` and `.md` files), utilities (CSS and JS snippets, images etc.), and underlying datasets, this repository uses the following structure:

safer-parks/
├── assets/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   └── styles/
├── content/
│   ├── index.qmd
│   └── ...
├── data/
├── docs/
│   ├── index.html
│   └── ...
├── _quarto.yml
├── .gitignore
├── .quarto/
├── README.md
└── LICENSE.txt

To [modify and update this file tree, follow this link](https://tree.nathanfriend.com/?s=(%27options!(%27fancy!true~fullPath!false~trailingSlash!true~rootDot!false)~3(%273%27safer-parks*assets0font20img%2F0j20style2*content4qmd6data7docs4html6_quarto.yml*.gitignore*.quarto7README.md*LICENSE.txt%27)~version!%271%27)*%5Cn50*52s%2F3source!40index.5%20%2060...*7%2F*%017654320*).

### `docs/`

This folder contains the built content produced by `quarto render` and shouldn't be modified by hand.

### `data/`

We may decide instead to point at an external repository for the dataset; however for the moment this folder exists to hold small datasets that are used by the webapp.

### `assets/fonts/` and `assets/styles/fonts.css`

These folder contain the local fonts to prevent API calls to Google fonts which are not compliant with GDPR. This [YouTube video](https://www.youtube.com/watch?v=vaPBOqfus7w) details how to use the `gfonts` R package to download and organise fonts from Google fonts to use them locally (in compliance with GDPR).

## Fonts and GDPR guidelines

In order to comply with GDPR guidelines, the custom scss files for this project prevent Quarto loading Google Fonts on the fly. Instead, all custom fonts must be stored locally in this directory. See previous section for directory structure.