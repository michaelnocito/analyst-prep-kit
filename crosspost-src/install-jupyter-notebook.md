By the end of this page you will have Jupyter installed, a notebook open in your browser, and a cell that prints a real table. You will also know what the kernel menu in the corner is actually choosing between, which is the difference between fixing your own problems in thirty seconds and reinstalling everything for the third time.

Here is what to actually do today. Run `python -m pip install jupyterlab`, then `jupyter lab`, and leave the terminal window open. That last part is not a detail. Closing the terminal stops the notebook, because the terminal is running the thing your browser is only displaying.

The short version: install it with pip, launch it with one word, and remember that a notebook is three separate programs talking to each other. The browser page is not the notebook, and the file on disk is not the notebook either.

Those three parts are the one idea everything else here hangs from, so they get the picture.

> _The original carries a diagram here. In words: Three boxes in a row, connected left to right by double-headed arrows. The left box is drawn as a browser window with a tab and an address bar. The middle box is drawn as a terminal window with a blinking cursor line. The right box is drawn as a plain container holding a small snake-shaped mark, representing one Python. Beneath the left box sits a small document icon, connected upward by a thin line to the middle box only, showing the file is handled by the server rather than by the browser or the Python. A dashed outline surrounds the middle and right boxes together, marking the pair that keeps running when the browser closes._

**This page assumes Python is already installed.** If `python --version` does not answer in a terminal, start with [how to install Python for data analysis](https://michaelnocito.github.io/analyst-prep-kit/guides/install-python-for-data-analysis/), which also explains the `python -m pip` form used below and why it matters. The versions quoted here are the ones on the machine I checked on 8 August 2026: JupyterLab 4.5.8, Notebook 7.5.7, ipykernel 7.3.0.

## 1. What a notebook is for, and when to use something else

Before the explanation: think of the last analysis you did in a spreadsheet. Which parts of it would you want to re-run next month, and which parts were you only doing to have a look?

A **notebook** is a document made of cells. Some cells hold code, and running one shows its output directly underneath. Others hold notes. The result is a single file that carries the question, the code, the answer and the commentary in the order you thought of them.

That shape suits exploring: you load a file, look at it, notice something odd, check that one thing, then follow it. Each step keeps its evidence attached. It suits a finished, scheduled, repeatable job much less well, because the notebook lets you run cells in any order and a plain script does not. Use a notebook to find the answer, and move the settled parts into a `.py` file once you know what they are.

## 2. Install it

There are two front ends and they install the same way. JupyterLab is the current one, with a file browser and tabs. Notebook is the older, simpler single-document window, now rebuilt on the same foundations. Either is fine, and installing one does not prevent the other.
    
    
    python -m pip install jupyterlab

Or, for the simpler window:
    
    
    python -m pip install notebook

Write it as `python -m pip` rather than bare `pip`. That form means "the pip belonging to this exact Python", which is what stops Jupyter installing into one Python while your packages sit in another. On a machine with more than one Python, that mismatch is the single most common reason a fresh install appears broken.

If you installed Anaconda, both are already there and you can skip this step entirely.

## 3. Launch it, and what the terminal is now doing

Move to the folder you want to work in first, then launch. The folder you are standing in becomes the notebook's home, and it cannot see files above it.
    
    
    cd path/to/your/project
    jupyter lab

A browser tab opens on an address like `http://localhost:8888/lab?token=...`. Read that address, because it explains the whole arrangement. `localhost` means a server running on your own machine, not on the internet. `8888` is the door number it is listening on. The `token` is a one-time password, which exists so that other programs on your machine cannot quietly drive your Python.

Your terminal is now full of log messages and will not accept new commands. That is correct. The terminal is running the server, so leaving it open is what keeps the notebook alive. Minimise that window, do not close it, and open a second terminal if you need one.

## 4. Your first cell, and the number in the brackets

Click the blue plus for a new notebook, choose Python 3, and type this into the first cell.
    
    
    import pandas as pd
    
    df = pd.DataFrame({'region': ['East', 'West'], 'sales': [790, 560]})
    df

Press **Shift and Enter** together to run it. That combination runs the cell and moves to the next one, and it is the only keyboard shortcut you need on day one.
    
    
      region  sales
    0   East    790
    1   West    560

Look at the left edge of the cell. It changed from `[ ]` to `[1]`. That number is the run counter: this was the first cell run since the kernel started. It is not the cell's position in the document, and the difference between those two things is the subject of section 6.

One notebook habit worth forming immediately: the last line of a cell displays itself without needing `print`. That is why `df` alone printed a table. It also means a stray variable name on the last line will quietly dump something large into your document.

## 5. The kernel menu, and why your environment is missing from it

Before the explanation: you made a virtual environment, installed pandas into it, and started Jupyter. The kernel menu does not list it. Where do you think the packages went?

The **kernel** is the Python that actually runs your cells. Jupyter can talk to several, and the menu in the top right is choosing between them. Nothing forces that Python to be the same one Jupyter itself was installed into, which is exactly why a notebook can report that pandas is missing while a terminal on the same machine imports it happily.

A Python appears in that menu only if it has been registered as a kernel. Your new virtual environment has not been, so it is absent, and the notebook silently uses a different Python instead. The packages went nowhere. You are looking at them from the wrong Python.

Two ways to fix it, and they are genuinely different choices rather than two spellings of one.

**The simple route: launch Jupyter from inside the environment.** Activate it, install Jupyter there, and run it there. One environment, one Jupyter, nothing to register.
    
    
    .venv\Scripts\activate
    python -m pip install jupyterlab pandas
    jupyter lab

**The tidy route: register the environment as a named kernel.** One Jupyter, many projects, each appearing by name in the menu.
    
    
    .venv\Scripts\activate
    python -m pip install ipykernel
    python -m ipykernel install --user --name myproject --display-name "Python (myproject)"

`ipykernel` is the small package that makes a Python answerable to Jupyter, and the second command writes a short description of where that Python lives into a place Jupyter reads at startup. Restart Jupyter and "Python (myproject)" is in the menu. Start with the simple route while you have one project; move to the tidy one when you have four.

Whichever you choose, prove it from inside the notebook rather than trusting the label. Run this in a cell:
    
    
    import sys
    print(sys.executable)

That prints the full path of the Python running your code. If it does not contain your project folder when you expected it to, the kernel is not the one you meant, and no amount of reinstalling pandas will change that.

## 6. Run order, and the bug it creates

A notebook runs cells in the order you press Shift and Enter, not the order they appear on the page. The document is a record of your thinking; the kernel's memory is a record of your keystrokes. Those two can drift apart, and when they do the notebook shows an answer that its own code no longer produces.

The way it usually happens: you write a cell, run it, edit it, run something above it, then delete the cell that created a variable. The variable is still in memory, so everything keeps working. Send the file to someone else and it fails immediately, because their kernel never ran the deleted cell.

The bracket numbers are your evidence. If they read 1, 2, 7, 3 down the page, the page is not in run order. The fix is one menu item, and it should be the last thing you do before sharing anything: **Kernel, then Restart Kernel and Run All Cells**. That empties the memory and runs the document top to bottom, exactly as a stranger would. If it survives that, it is real.

Now picture your own last piece of analysis, whatever tool it was in. If you wiped everything except the file and re-ran it from the top, which step would fail first? That step is the one living in your memory rather than in your work, and the restart is how you find it before someone else does.

## 7. Shut it down properly

Closing the browser tab does not stop anything. The server and the kernel are still running, still holding your data in memory, and still occupying port 8888. That is the direct consequence of the picture at the top: you closed the left box only.

To stop it, go back to the terminal running the server and press **Ctrl and C** , twice if it asks for confirmation. The prompt returns and everything is released. Skipping this is why a second launch sometimes reports that port 8888 is in use and quietly moves to 8889, leaving you with two servers and a confusing pair of tabs.

## The full before and after

Same notebook, same code, handed to a colleague.

### Before
    
    
    In [ 7]: sales_by_region = df.groupby('region')['sales'].sum()
    In [ 3]: sales_by_region.plot(kind='bar')
    In [12]: total = sales_by_region.sum()

It works on your screen. The bracket numbers are 7, 3, 12 down the page, which says the cells were run in an order the document does not describe. `df` may have been created in a cell you have since deleted. Nothing here is wrong, exactly; it simply cannot be reproduced, and reproducing it is the entire point of writing it down.

### After
    
    
    In [1]: import pandas as pd
    In [2]: df = pd.read_csv('sales.csv')
    In [3]: sales_by_region = df.groupby('region')['sales'].sum()
    In [4]: sales_by_region.plot(kind='bar')
    In [5]: total = sales_by_region.sum()

Same analysis, after Restart Kernel and Run All Cells. The numbers run 1 to 5 in order, which is proof rather than tidiness: every cell ran, in the order shown, from an empty memory. The data now comes from a file on disk rather than from a variable that happened to still be around. Anyone can open this and get your answer.

## What goes wrong, and the fix

Six that account for nearly all of it.

**"jupyter is not recognized."** It installed into a Python that is not on your PATH. Run it through the interpreter instead: `python -m jupyter lab`. That always works if the install worked.

**ModuleNotFoundError inside a notebook for a package you definitely installed.** Section 5. Run `import sys; print(sys.executable)` in a cell and compare it to what your terminal reports. The kernel is a different Python.

**The browser does not open, or opens a blank page.** Copy the `http://localhost:8888/lab?token=...` line out of the terminal and paste it into your browser. Without the token you get a password prompt you have no password for.

**Port 8888 is already in use.** A previous server is still alive, usually because a browser tab was closed instead of the terminal. Find that terminal and press Ctrl and C, or launch on another door with `jupyter lab --port 8889`.

**The file browser cannot see your data.** Jupyter can only reach the folder you launched it from and below. Stop it, `cd` to the right folder, and launch again. It is not a permissions problem.

**The kernel keeps dying on one cell.** Usually memory: something loaded a file far larger than it looks. Read a slice first with `pd.read_csv('big.csv', nrows=1000)` and see what you are dealing with. [Handling large datasets](https://michaelnocito.github.io/analyst-prep-kit/guides/handle-large-datasets/) covers what to do when the file is genuinely too big.

## Why this works

The three-part split looks like an odd design until you see what it buys. Because the kernel is a separate program communicating over a defined message protocol, it does not have to be Python at all, which is where the name Jupyter comes from: Julia, Python and R. It also does not have to be on your machine, which is why the same notebook interface works unchanged against a server elsewhere. And because the front end only sends messages and draws replies, closing it cannot disturb a running calculation. Every awkward behaviour on this page, the terminal you must leave open, the browser you cannot simply close, the kernel menu, is the price of that separation, and it is a fair one.

The reproducibility problem in section 6 is not a beginner's mistake, it is a property of the medium, and it has been measured. A study that collected roughly 1.4 million publicly available Jupyter notebooks from GitHub and tried to re-run them found that only a small fraction executed to completion and reproduced their original results, with out-of-order execution counts among the recurring causes (Pimentel, Murta, Braganholo, & Freire, 2019, _Proceedings of the 16th International Conference on Mining Software Repositories_ , 507–517). Restart and Run All is the cheap defence against the exact failure that study counted.

One note on the way this page is written. It kept asking you to commit to an answer, where the packages went, which step would fail first, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own machine

Five habits, in order. The first two take a week to become automatic and then save you permanently.

  1. **Launch from the project folder** , never from your home directory. The file browser's reach is decided at launch and cannot be widened afterwards.
  2. **Put`print(sys.executable)` in the first cell** of any notebook that will outlive today. It answers the only genuinely confusing question in this tool.
  3. **Restart Kernel and Run All before you share or trust anything.** Every time. It is the difference between a result and a screenshot of one.
  4. **Load data from a file, not from a variable you made earlier.** If a cell depends on something that is not in the document, the document is incomplete.
  5. **Move settled code out into a`.py` file.** The notebook is where you find the answer. It is a poor place to keep one.

If you have paper nearby, one optional drawing is worth five minutes. Draw the three boxes from the top of this page and label each with what closing it would destroy: the browser, nothing; the server, the notebook connection; the kernel, every variable you have made. Getting those three consequences the right way round is the whole model.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                               | What it is, or what it does                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| Notebook                            | A document of cells. Code cells show their output directly underneath.      |
| Browser                             | Draws the page. Closing it stops nothing.                                   |
| Server                              | Runs in your terminal, owns the file. Leave that terminal open.             |
| Kernel                              | The Python that runs your cells and holds your variables.                   |
| `python -m pip install jupyterlab`  | Installs the current front end. `notebook` installs the simpler one.        |
| `jupyter lab`                       | Launches it. `python -m jupyter lab` if the word is not recognized.         |
| localhost:8888                      | A server on your own machine, at door 8888. Not on the internet.            |
| token in the URL                    | A one-time password so other programs cannot drive your Python.             |
| Shift and Enter                     | Run this cell and move to the next.                                         |
| `[1]` beside a cell                 | Run order, not page position. Out-of-sequence numbers are a warning.        |
| Missing environment in kernel menu  | It was never registered. Launch from inside it, or register with ipykernel. |
| `ipykernel install --user --name X` | Makes an environment appear in the kernel menu as X.                        |
| `sys.executable`                    | Prints which Python is really running the cell. Settles every argument.     |
| Restart Kernel and Run All          | Empties memory, runs top to bottom. The only real proof it works.           |
| Ctrl and C in the terminal          | The correct way to shut the server down and free the port.                  |
| Port already in use                 | An old server is still running. Stop it, or use `--port 8889`.              |

**The one habit to keep.** Restart Kernel and Run All Cells before you believe a notebook, including your own. A result that only exists because of the order you happened to press the buttons in is not a result yet. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The first notebook I sent to somebody else failed on their machine at the second cell, because the variable it needed had been made in a cell I deleted an hour earlier. What was living in your kernel's memory that was never in your file?

## References

  * Pimentel, J. F., Murta, L., Braganholo, V., & Freire, J. (2019). A large-scale study about quality and reproducibility of Jupyter notebooks. _Proceedings of the 16th International Conference on Mining Software Repositories (MSR '19)_ , 507–517.
  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.

---

*Originally published on Analyst Prep Kit: [How to Set Up Jupyter Notebook (And Why Your Environment Is Missing From the Kernel List)](https://michaelnocito.github.io/analyst-prep-kit/guides/install-jupyter-notebook/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
