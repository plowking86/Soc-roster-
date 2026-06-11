# Jess Roster App

A simple standalone roster web app for Jess.

## What it does

- Shows Jess's roster from `DLRSOC.xlsm`
- List view, week view, and month view
- Search by date, shift, or note
- Add swaps and notes
- Saves swaps/notes locally in the browser
- Works as a static site on GitHub Pages

## Run locally

Open `index.html` in a browser.

Or run a local server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Put on GitHub Pages

1. Create a new GitHub repo, for example `jess-roster-app`.
2. Upload all files from this folder.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** root
5. Save.
6. GitHub will give you a website link after it deploys.

## Notes

This app does not need a backend or database. Swaps and notes are saved in the device/browser using `localStorage`, so they do not sync across phones unless extra sync is added later.
