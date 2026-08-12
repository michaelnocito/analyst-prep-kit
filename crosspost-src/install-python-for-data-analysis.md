By the end of this page you will have Python installed, pandas installed into that same Python, and a two-line check that proves both. You will also understand the failure that costs beginners more hours than anything else in this subject: `pip install pandas` reports success, and then `import pandas` says there is no such thing. That is not a broken install. It is two Pythons, and this page shows you how to see them.

Here is what to actually do today. Install Python from python.org, tick **Add python.exe to PATH** on the first screen, then install packages with `python -m pip install pandas` rather than plain `pip install pandas`. Those two details prevent almost every problem below.

The short version: one Python, packages installed through that Python by name, and a virtual environment per project once you have more than one project. Anaconda is an alternative worth one paragraph, further down, and the licence rule attached to it matters if you work anywhere with more than 200 staff.

The reason `pip` can succeed and `import` can still fail is one idea, so it gets the picture.

> _The original carries a diagram here. In words: Two large boxes side by side, each representing a separate Python installation on the same computer. The left box contains a small shaded tile labelled with a package icon, showing the package was installed there. The right box is empty. An arrow from a pip command at the top left points down into the left box, delivering the tile. A second arrow, from a script at the top right, points down into the right box, which has no tile in it. The right box carries a small cross, showing the import failed. Both boxes sit on the same ground line, meaning both are installed on one machine._

**Every command output on this page is real.** It was run on a Windows 11 machine on 8 August 2026, including the failure in section 5, which is genuinely how that machine is configured rather than something staged. Your version numbers will differ. The shapes will not.

## 1. Check what you already have

Before the explanation: how many copies of Python do you think are on your computer right now? Commit to a number, then run the check.

Python often arrives without being asked for, bundled inside other software. Installing another one on top is how people end up with the problem in section 5. So look first. Open a terminal, which on Windows means Command Prompt or PowerShell, and on a Mac means Terminal, then run:
    
    
    python --version

On Windows there is a second command worth knowing, and it is more useful than the first. `py` is the Python launcher, a small program that ships with the official Windows installer and knows about every Python on the machine. Ask it to list them:
    
    
    py -0

Here is what that printed on my machine, alongside the version `python` reports:
    
    
    > python --version
    Python 3.11.0
    
    > py -0
     -V:3.14 *        Python 3.14 (64-bit)
     -V:3.12          Python 3.12 (64-bit)
     -V:3.11          Python 3.11 (64-bit)

Three Pythons, and the two commands disagree about which one is in charge. `py` defaults to 3.14, marked with the asterisk. The word `python` reaches 3.11. Neither is wrong and nothing here is broken, but every package instruction you follow from now on has to say which one it means. If your machine reports "not recognized" or "command not found" instead, you have none, which is the simplest case. Carry on to the next step.

## 2. Install Python, and the one checkbox that matters

Go to [python.org/downloads](https://www.python.org/downloads/) and take the version it offers you. As of 8 August 2026 that is Python 3.14.7. Any 3.12 or later is fine for analysis work.

On the very first screen of the Windows installer there is a checkbox at the bottom reading **Add python.exe to PATH**. Tick it before you click Install. PATH is the list of folders your terminal searches when you type a command, so ticking that box is what makes the word `python` work in a terminal at all. Leave it unticked and every command on this page returns "not recognized", which reads like a failed install and is not one.

On a Mac the installer has no such checkbox, because it wires that up for you. The one thing to know on macOS is that a `python3` may already exist as part of the system, and you should leave it alone rather than replace it. Use the one you installed.

Close your terminal and open a fresh one after installing. A terminal reads PATH when it starts and never looks again, so the window that was already open cannot see your new Python. This single fact accounts for a large share of "I installed it and it still does not work".

## 3. Anaconda or python.org: one question decides it

Before the explanation: you will read that Anaconda is "for data science" and python.org is "plain Python". What would actually be different on your machine after choosing one over the other?

Anaconda is Python plus several hundred packages already installed, plus its own tool for installing more. The practical difference is that pandas, NumPy, matplotlib and Jupyter are there the moment it finishes, and you skip the next section entirely. The cost is about 5 GB of disk and a second package system to learn alongside pip.

The question that decides it is not technical. **How many people work at the organisation you will use this at?** Anaconda's terms of service make its distribution free for individuals and for organisations under 200 employees or contractors, and require a paid licence at 200 or more. That threshold counts government bodies and non-profits, not just companies. Use at accredited educational institutions for teaching, learning and research is exempt from the count.

So: learning at home, or at a small company, either choice is fine and Anaconda saves you a step. Heading into a large employer, install from python.org and use pip, because that is what you will be allowed to run there and it is worth having the habits already. That is the whole decision, and it is the same shape as the one in [which SQL database to install](https://michaelnocito.github.io/analyst-prep-kit/guides/which-sql-database-to-install/): pick for the situation you are heading into, not for the feature list.

If you want Anaconda's convenience without the size, Miniconda is the same tool with almost nothing preinstalled. The same licence terms apply to it, so it does not change the answer to the question above.

## 4. Install pandas so it lands in the right place

pandas is the library that gives Python tables. Without it, Python has lists and dictionaries but no concept of a spreadsheet-shaped thing with named columns. Install it, and the three that always travel with it, like this:
    
    
    python -m pip install pandas numpy matplotlib openpyxl

Read the command left to right, because the shape is the whole lesson. `python` is the interpreter you are aiming at. `-m pip` means "run the pip module that belongs to _this_ interpreter". `install` and the four names are the actual request. Written this way, the package can only land in the Python you named.

The four names, briefly. **pandas** is tables. **NumPy** is the fast number engine pandas is built on, and it installs automatically anyway. **matplotlib** draws charts. **openpyxl** is what lets pandas read and write `.xlsx` files, and it is the one nobody mentions until the day `read_excel` fails with a missing-dependency error.

On Windows, swap `python` for `py -3.14` if you want to be explicit about which one you mean. `py -3.14 -m pip install pandas` is unambiguous, and being explicit costs six characters.

## 5. The failure, shown on a real machine

Here is why plain `pip` is the risky habit. On my machine, asking three different ways where pip lives gives two different answers, and one outright error:
    
    
    > pip -V
    pip 26.1.2 from C:\Users\Mike\AppData\Roaming\Python\Python311\site-packages\pip (python 3.11)
    
    > python -m pip -V
    pip 26.1.2 from C:\Users\Mike\AppData\Roaming\Python\Python311\site-packages\pip (python 3.11)
    
    > py -m pip -V
    C:\Users\Mike\AppData\Local\Programs\Python\Python314\python.exe: No module named pip

Say what that third line means before reading on.

The bare word `pip` is its own little program sitting in a folder on PATH, and on this machine it belongs to Python 3.11. So `pip install pandas` would put pandas into 3.11. But `py`, the launcher, defaults to 3.14. Anything I run with `py` would go looking in 3.14, find nothing, and report `ModuleNotFoundError: No module named 'pandas'`, minutes after an install that said "Successfully installed". Both messages are true at once.

Now picture your own machine, with whatever your `py -0` listed. If you install with one word and run with another, which box does each arrow in the picture at the top point at? That question is the whole failure, and `python -m pip` is the answer to it, because it makes both arrows point at the same name.

## 6. A virtual environment, and why it ends this for good

A **virtual environment** is a folder holding its own private copy of Python and its own packages, belonging to one project. Work inside it and there is no ambiguity left to have, because the project only has one Python to reach.

Three commands. Make it, switch into it, install into it.
    
    
    python -m venv .venv
    
    # Windows
    .venv\Scripts\activate
    
    # Mac or Linux
    source .venv/bin/activate
    
    python -m pip install pandas matplotlib openpyxl

Once activated, your terminal prompt gains a `(.venv)` prefix, which is the visible sign that you are inside it. From then on, plain `python` and plain `pip` both mean the environment's copies, and the two-Pythons problem cannot happen. Type `deactivate` to step back out.

Do this per project rather than once for everything. The payoff arrives later: a project you return to in six months still has the package versions it was written against, rather than whatever your machine has drifted to. If the project is in Git, add a line reading `.venv/` to your `.gitignore`, because the folder is large, rebuildable, and specific to your machine. [Git for analysts](https://michaelnocito.github.io/analyst-prep-kit/guides/git-for-analysts/) covers what else belongs in that file.

## 7. Prove the whole thing works

An install is not finished when the installer closes. It is finished when a table comes out. Run this in one line:
    
    
    python -c "import pandas, sys; print(pandas.__version__); print(sys.version)"
    
    
    3.0.2
    3.11.0 (main, Oct 24 2022, 18:26:48) [MSC v.1933 64 bit (AMD64)]

Two lines, two facts. The first is the pandas version, which proves the package imported rather than merely downloaded. The second names the exact Python that found it, which is the piece almost every install guide leaves out. Print both, and you never have to guess which box you are standing in.

Then make an actual table, because that is what you came for:
    
    
    python -c "import pandas as pd; print(pd.DataFrame({'region':['East','West'],'sales':[790,560]}))"
    
    
      region  sales
    0   East    790
    1   West    560

## The full before and after

Same goal both times: get pandas working.

### Before
    
    
    pip install pandas
    python my_script.py

This works on a machine with exactly one Python and fails silently on a machine with two. Nothing in either command names a version, so which Python receives the package and which Python runs the script are both decided by PATH, which is a setting you did not choose and cannot see. When it breaks, the error says the package is missing, which points you at reinstalling the package. Reinstalling puts it in the same wrong place, faster.

### After
    
    
    python -m venv .venv
    .venv\Scripts\activate
    python -m pip install pandas matplotlib openpyxl
    python -c "import pandas, sys; print(pandas.__version__); print(sys.version)"

Every step names its interpreter, and the last line prints proof rather than assuming it. The environment folder makes the answer to "which Python" a property of the project rather than of your machine's history, so the same four lines behave identically on your laptop, on a colleague's, and on a fresh install a year from now.

## What goes wrong, and the fix

Six that account for nearly all of it.

**"python is not recognized as an internal or external command."** Either PATH was not ticked during install, or the terminal was already open when you installed. Open a new terminal first. If it still fails, re-run the installer, choose Modify, and tick the PATH option.

**ModuleNotFoundError right after a successful install.** This is section 5. Run `python -m pip -V` and `python -c "import sys; print(sys.executable)"` and compare the two paths. If they disagree, install with `python -m pip` and the disagreement is gone.

**"externally-managed-environment" on a Mac or Linux.** The system is protecting its own Python from your changes, and it is right to. Do not force past it with the flag it suggests. Make a virtual environment, as in section 6, and install there.

**Permission denied, or a suggestion to use sudo.** Never install packages with `sudo`. It writes into the system Python, which is the one the operating system depends on. A virtual environment needs no elevated permission at all.

**read_excel fails with a missing optional dependency.** pandas can read `.xlsx` only through a helper. `python -m pip install openpyxl` and the same line will work.

**The terminal opens somewhere you did not expect.** A new terminal starts in your home folder, not next to your file. `cd` to the folder holding your script before running it, or the error will be about a missing file rather than a missing package.

## Why this works

The mechanism is worth understanding once, because it makes every one of these errors readable rather than mysterious.

When you type a bare command, your shell walks the folders listed in PATH, in order, and runs the first match it finds. That is all PATH is: a search order. So `python` and `pip` are not names of things, they are the winners of two separate searches, and nothing guarantees the two winners belong together. Adding `-m pip` replaces the second search with a lookup inside the first winner, which is why the ambiguity disappears. A virtual environment attacks the same problem from the other end: activating it puts one folder at the front of PATH, so both searches land in the same place by construction.

That also explains the fix nobody believes: opening a new terminal. A process receives its copy of the environment when it starts and keeps it, so a terminal opened before the install is holding a PATH from before the install existed. Nothing is cached and nothing is broken; you are simply asking a window that has an old list.

One note on the way this page is written. It kept asking you to commit to an answer, how many Pythons you had, what the third line meant, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725). Guessing three and finding one is what makes the fact stick.

## Using this on your own machine

Do this in order, once, and you will not fight the install again.

  1. **Run`py -0` before installing anything**, or `which -a python3` on a Mac. Know what is already there.
  2. **Install from python.org and tick PATH** , unless you are learning at home or at a small organisation and want Anaconda's head start.
  3. **Type`python -m pip`, never bare `pip`**. Make it the only way you write it and the habit costs nothing.
  4. **One virtual environment per project** , named `.venv`, created the same day the folder is. Add it to `.gitignore` immediately.
  5. **End every setup by printing proof** : the package version and `sys.version` together. An install you have not seen import is not an install yet.

If you have paper nearby, one optional drawing is worth five minutes. Draw a box for each Python your `py -0` listed, then draw the arrow your install command takes and the arrow your run command takes. Where those two arrows land, on your own machine, is the answer to every error message in this guide.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                             | What it is, or what it does                                                                         |
|-----------------------------------|-----------------------------------------------------------------------------------------------------|
| PATH                              | The ordered list of folders your terminal searches when you type a command.                         |
| Add python.exe to PATH            | The one checkbox on the Windows installer. Unticked means `python` is not recognized.               |
| `py -0`                           | Windows only. Lists every Python installed. The asterisk marks the default.                         |
| `python --version`                | The version PATH happens to reach. Can differ from what `py` reaches.                               |
| `python -m pip install X`         | Install X into _this_ interpreter. The safe form, always.                                           |
| Bare `pip install X`              | Installs into whichever Python owns the pip that PATH found first.                                  |
| ModuleNotFoundError after install | Two Pythons. The package landed in one, the script ran in the other.                                |
| `sys.executable`                  | The full path of the Python actually running. Settles every argument.                               |
| `python -m venv .venv`            | Creates a private Python and package set for one project.                                           |
| Activate                          | `.venv\Scripts\activate` on Windows, `source .venv/bin/activate` elsewhere. Prompt gains `(.venv)`. |
| externally-managed-environment    | The system Python is protected. Use a virtual environment, do not force it.                         |
| `sudo pip install`                | Never. It writes into the Python the operating system depends on.                                   |
| The four packages                 | pandas (tables), NumPy (numbers), matplotlib (charts), openpyxl (xlsx files).                       |
| Anaconda licence                  | Free under 200 employees or contractors. 200+ needs a paid licence. Accredited teaching is exempt.  |
| New terminal after installing     | A terminal reads PATH once, at start. The old window cannot see the new install.                    |

**The one habit to keep.** Write `python -m pip` every time, and finish every setup by printing the package version and `sys.version` together. Those two moves make the two-Pythons failure impossible to have and trivial to diagnose. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. I lost an evening once to a script that could not find a package I had just watched install, and the answer turned out to be a second Python I did not know a piece of software had put there. What was hiding on your machine, and how did you finally spot it?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Anaconda, Inc. Terms of Service. Retrieved 8 August 2026 from anaconda.com/legal/terms/terms-of-service. Cited for the 200-employee threshold, which is a licence term rather than a research finding.

---

*Originally published on Analyst Prep Kit: [How to Install Python for Data Analysis (And Why pip install Then Fails)](https://michaelnocito.github.io/analyst-prep-kit/guides/install-python-for-data-analysis/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
