# Nadun Charuka Perera - Personal Portfolio

A responsive personal portfolio built with plain **HTML5, CSS3 and JavaScript** (no frameworks, no build step). It presents an Engineering Technology undergraduate profile: construction technology, electronics, robotics and embedded systems.

Features: dark/light theme, mobile menu, smooth scrolling, scroll animations, skills filter, certification gallery, project cards, education and experience timelines, contact form, back-to-top button, custom error page.

## Folder structure

```
my-portfolio/
├── index.html                  Main page (all content lives here)
├── Error.html                  Custom "page not found" page
├── staticwebapp.config.json    Azure Static Web Apps settings (uses Error.html for 404s)
├── css/style.css               All styling and theme colours
├── js/script.js                All behaviour
├── images/
│   ├── profile.jpg             YOUR PHOTO (add this)
│   ├── projects/               Project screenshots (optional)
│   └── certificates/           Certificate images (add these)
├── assets/
│   └── cv.pdf                  YOUR CV (add this)
└── README.md
```

## Run it locally

**Easiest:** double-click `index.html` to open it in your browser.

**Better (recommended):** run a tiny local server so everything behaves like the live site.

- With VS Code: install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**.
- Or with Python installed, run this in the project folder, then open http://localhost:8000:

  ```
  python -m http.server 8000
  ```

Font Awesome and Google Fonts load from the internet, so you need a connection to see icons and fonts.

## How to personalise it

Everything marked `[Add ...]` is a placeholder. Open `index.html` and search for these:

| What | Where to look | What to do |
| --- | --- | --- |
| LinkedIn / GitHub links | Search `placeholder-link` | Replace `href="#"` with your URL and delete `placeholder-link` from the class |
| Email and phone | Section "Contact" (search `Add your professional email`) | Replace the text |
| Education years | Search `Add starting year` | Type your real start and expected graduation years |
| O/L and A/L results | Search `Add GCE O/L` | Add only qualifications you actually hold |
| Profile photo | `images/profile.jpg` | Save your photo with exactly this name (initials show until then) |
| Certificate images | `images/certificates/intro-to-git.jpg` and `cloud-service-types.jpg` | Save screenshots or PDFs-as-images with these names, or change the `src` in the HTML |
| CV | `assets/cv.pdf` | Save your CV with this name |
| Project links | Each project card | Replace `href="#"` for GitHub, demo or simulation links |
| Contact form email | `js/script.js`, line `var RECIPIENT = ""` | Put your email in the quotes |
| Colours | Top of `css/style.css` | Edit the variables in `:root`, `[data-theme="dark"]` and `[data-theme="light"]` |

### Adding a new certificate

Copy one `<article class="cert-card reveal">...</article>` block in the Certifications section, then change the title, organisation, date and image path.

### Adding a new project

Copy a whole `<article class="project-card reveal">...</article>` block in the Projects section and edit it. Use the `badge-dev` (in development) or `badge-live` (ongoing) badge so the status stays honest.

### Adding a skill

Add `<span class="skill">Name</span>` inside the right group in the Skills section. Add `<em>Beginner</em>` after the name if you want to show a level.

## About the contact form

A static site has no server, so the form checks the fields and then opens the visitor's email app with the message filled in (set `RECIPIENT` in `js/script.js`). If you want messages delivered without the visitor's email app, you can connect a free form service such as Formspree, or an Azure Functions API later.

## Deploy to GitHub

1. Create a new repository on GitHub (for example `my-portfolio`).
2. In the project folder run:

   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/my-portfolio.git
   git push -u origin main
   ```

Optional: enable **GitHub Pages** under *Settings > Pages* (branch `main`, folder `/root`). Note that on GitHub Pages the custom error page works only if it is named `404.html`; Azure handles it through `staticwebapp.config.json` instead.

## Deploy to Microsoft Azure Static Web Apps

This site needs **no build**, so setup is simple.

1. Push the project to GitHub (above).
2. In the [Azure portal](https://portal.azure.com), choose **Create a resource > Static Web App**.
3. Pick your subscription, resource group, a name, and the **Free** plan.
4. Under *Deployment details*, select **GitHub**, sign in, then choose your repository and the `main` branch.
5. Under *Build details*, choose **Custom** and set:
   - **App location:** `/`
   - **Api location:** leave empty
   - **Output location:** leave empty (or `/`)
6. Click **Review + create**, then **Create**. Azure adds a GitHub Actions workflow to your repo and publishes the site. Every `git push` to `main` redeploys automatically.

`staticwebapp.config.json` is already included. It sends missing pages to `Error.html` and adds basic security headers.

Alternative: the **Azure Static Web Apps** extension for VS Code can deploy straight from your folder.

## Honesty note

This portfolio contains only the details you provided. Grades, qualifications, certificates, awards, leadership positions and project completion results are left as editable placeholders and should be added only when they are real and verifiable.
