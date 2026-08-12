Git looks like a wall of scary commands. As an analyst you only need a small, repeatable core: save your work with a note, and send it to GitHub so it is backed up and shareable. That is 90% of what you will ever do. This guide teaches that core. It then shows how to start a project and publish it as a live web page. Last, it lists the handful of errors that trip up everyone the first time.

**Git vs GitHub, in one line.** **Git** is the tool on your computer that tracks changes to your files. **GitHub** is the website that stores a copy online so it is backed up, shareable, and (with GitHub Pages) able to host a live site. You use Git locally; you push to GitHub.

## Step 1 — Install Git and set your identity (once)

  1. Install Git from [git-scm.com/downloads](https://git-scm.com/downloads) (all defaults are fine).
  2. Optionally install the **GitHub CLI** from [cli.github.com](https://cli.github.com/). It makes creating repos and signing in much easier.
  3. Open a terminal (Git Bash on Windows, Terminal on Mac) and tell Git who you are. This name and email get stamped on every save:

    
    
    git config --global user.name "Your Name"
    git config --global user.email "you@example.com"

If you installed the GitHub CLI, sign in to GitHub once with `gh auth login` and follow the prompts. This is what lets you push without pasting a password every time.

## Step 2 — The everyday loop (this is 90% of Git)

Three commands do almost all of it, and they always run in the same order. Once you have read them, cover the block and say the three back in order, because you will type this sequence more than everything else in this guide combined.

Every time you finish a chunk of work, you do the same three-beat move: stage, save, send. In a terminal opened inside your project folder:
    
    
    git status                 # see what changed (read this first, always)
    git add .                  # stage every changed file for the next save
    git commit -m "Add churn analysis notebook"   # save, with a short note
    git push                   # send it up to GitHub

That is the whole daily rhythm. `status` shows you what is about to be saved, `add` chooses the files, `commit` saves a snapshot with a message, and `push` uploads it. Do this often, with clear messages. Think of each commit as a labeled save point you can return to.

**Write commit messages a stranger could read.** "Fix" tells you nothing in three weeks. "Fix broken date parsing in sales report" tells you exactly what that save point was. Present tense, one line, specific.

## Step 3 — Start a brand-new project and put it on GitHub

You have a folder with your work in it and you want it on GitHub. From inside that folder:
    
    
    git init -b main           # start tracking this folder, on a branch called main
    git add .                  # stage everything
    git commit -m "First commit"   # your first save point

Now create the online home for it. The easy way, with the GitHub CLI, does it in one line and pushes at the same time:
    
    
    gh repo create my-project --public --source=. --remote=origin --push

No CLI? Create an empty repository on [github.com/new](https://github.com/new) (do not add a README, keep it empty). Then copy the two commands GitHub shows you under "push an existing repository". They look like this:
    
    
    git remote add origin https://github.com/yourname/my-project.git
    git push -u origin main

## Step 4 — Publish it as a live website (GitHub Pages)

If your project has an `index.html`, GitHub can host it as a real, shareable web page for free. On the repo's page: **Settings → Pages → Source: Deploy from a branch → Branch: main / (root) → Save.**

Wait one to two minutes for the first build, then visit:
    
    
    https://yourname.github.io/my-project/

**Give it a minute, and hard-refresh.** GitHub Pages does not update the instant you push. The first build takes a minute or two, and later changes can be held by your browser cache. If you do not see your change, wait, then hard-refresh (Ctrl+Shift+R). It is almost never actually broken.

## Step 5 — What NOT to commit

Think about your own project folder before reading the list. Which file in it would you be most embarrassed to publish to the internet by accident? That file is the reason this step exists.

Git is for your code and small files, not giant datasets. GitHub rejects files over 100 MB, and committing a 2 GB CSV or a database file is a mistake either way. You exclude files by listing them in a `.gitignore` file in your project root:
    
    
    # .gitignore
    *.db            # SQLite databases
    *.csv           # large raw data
    data/raw/       # a whole folder of source files
    node_modules/   # dependencies

The rule of thumb: commit the things needed to _rebuild_ the project (code, a small sample file, a README), not the heavy data itself. Anyone can re-download or regenerate the big files.

**Working with big data?** The companion guide [How to Handle Large Datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) covers why those files stay out of Git and how to handle them instead.

## The five errors everyone hits once

All five of these have stopped someone for an afternoon, and none of them mean you broke anything. Read each message before you read the fix, and try to say what Git is complaining about. The messages are badly worded, not complicated.

### 1. "Updates were rejected... fetch first"

Your push bounced because GitHub has changes your computer does not (common if you edited a file on the website, or work on two machines). Pull first, then push:
    
    
    git pull --rebase
    git push

### 2. It asks for a password and rejects it

GitHub stopped accepting account passwords over Git in 2021. Either sign in once with `gh auth login` (easiest), or create a **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens) and paste that token where it asks for a password.

### 3. "warning: LF will be replaced by CRLF"

Harmless. It is just Git noting that Windows and Mac/Linux mark line-endings differently. Your files are fine. Ignore it.

### 4. You committed a huge file by accident

Add it to `.gitignore`, then stop tracking it (this removes it from Git but keeps it on your disk):
    
    
    git rm --cached bigfile.csv
    git commit -m "Stop tracking large data file"

### 5. "fatal: not a git repository"

You are running Git in a folder that was never started with `git init`, or you are one folder too high or too low. Check where you are, and make sure you are inside the project folder.

## Cheat sheet

| Goal                           | Command                                          |
|--------------------------------|--------------------------------------------------|
| See what changed               | `git status`                                     |
| Save your work                 | `git add .` then `git commit -m "message"`       |
| Send it to GitHub              | `git push`                                       |
| Get others' changes first      | `git pull --rebase`                              |
| Start tracking a folder        | `git init -b main`                               |
| Create + push a new repo (CLI) | `gh repo create name --public --source=. --push` |
| Stop tracking a file           | `git rm --cached file`                           |

---

*Originally published on Analyst Prep Kit: [Git and GitHub for Analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/git-for-analysts/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
