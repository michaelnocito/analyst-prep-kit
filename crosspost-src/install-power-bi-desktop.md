By the end of this page Power BI Desktop will be installed and open, and you will know which of the two install routes suits your machine. The part worth reading first, especially on a work laptop: installing from the **Microsoft Store does not require administrator rights** , and the direct download does. If you have ever been blocked by a password prompt you cannot answer, that one sentence is the whole guide.

Here is what to actually do today. Open the Microsoft Store, search for Power BI Desktop, and click Install. It updates itself afterwards, which matters more than it sounds because Microsoft ships a new version every month and supports only the latest one.

The short version: Store install for most people, direct download when you need a specific version or your organisation blocks the Store. Windows only, 64-bit only, and the Power BI service in a browser is the answer on a Mac.

The admin-rights fork is the one idea that decides your route, so it gets the picture.

> _The original carries a diagram here. In words: A single starting point on the left splits into two paths that both end at the same installed application on the right. The upper path runs straight through, unobstructed. The lower path passes through a closed gate drawn with a padlock hanging on it, so the path is interrupted before it can continue. Both paths reach the same destination box, showing the end result is identical and only the obstacle differs._

**Every requirement and limit on this page comes from Microsoft's own download documentation** , checked on 8 August 2026. Several widely quoted figures elsewhere are wrong in small ways, including the required .NET version, so this page uses the numbers Microsoft publishes rather than the ones that circulate.

## 1. Check your machine can run it

Before the explanation: which do you think stops more people, not enough memory or not enough screen?

It is the screen, and almost nobody expects that. Here is what Microsoft actually requires.

| Requirement      | What it has to be                                                                       |
|------------------|-----------------------------------------------------------------------------------------|
| Operating system | Windows 10 or Windows Server 2016 or later. There is no macOS or Linux version.         |
| Processor        | 64-bit. The 32-bit version is no longer supported at all.                               |
| Memory           | 2 GB available at minimum, 4 GB or more recommended.                                    |
| Display          | At least 1440x900 or 1600x900. Lower resolutions are not supported.                     |
| .NET             | 4.7.2 or later.                                                                         |
| Browser          | Microsoft Edge. Internet Explorer is no longer supported.                               |
| WebView2         | Normally installed alongside. If it is missing, Power BI Desktop will not run properly. |

The display line is worth reading twice, because Microsoft explains the consequence plainly: on a smaller screen, some controls, including the button that closes the startup screen, are drawn beyond the edge of what you can see. The application is running correctly and you simply cannot reach the button. On an older laptop at 1366x768, that is the failure you will get.

The related trap is Windows text scaling. If your display settings enlarge text and apps beyond 100%, some dialogs you must interact with will not appear. Both problems have the same shape, which is that a control exists somewhere off-screen, and both are fixed in Settings, System, Display rather than by reinstalling anything.

## 2. Install from the Microsoft Store

Open the Microsoft Store from the Start menu, search for **Power BI Desktop** , and click Install. That is the whole procedure, and it is the right one for most people for five reasons Microsoft lists directly.

It **needs no administrator rights** , which is the one that matters on a managed work machine. It **updates itself** in the background, so you stay on the only version Microsoft supports without thinking about it. Updates are **smaller** , because only changed components download. It can be **rolled out** across an organisation through the business Store. And it includes **all languages** , checking your Windows language each time it starts.

Two limitations come with it, both minor and both worth knowing. If you use the SAP connector, you may need to move the SAP driver files into your Windows System32 folder. And the Store version does not inherit settings from a previous installer-based version, so you may have to reconnect to your recent data sources and enter credentials again.

## 3. When to use the direct download instead

The direct route is an executable from Microsoft's Download Center. Choose the 64-bit build, since the 32-bit one is no longer supported, and run it. **You must be an administrator for this installation to complete.** That is the gate in the picture.

Use it when one of these is true. Your organisation blocks the Microsoft Store, which is common. You need a **specific older version** , because your team is on one and newer files cannot be opened by older releases. Or you are an administrator deploying it to other people, in which case the installer accepts command-line switches such as `-quiet` and `ACCEPT_EULA=1` for an unattended install.

One thing not to do: installing the older installer-based version and the Store version side by side is not supported. If you are switching, uninstall the old one first.

There is also a separate build for Power BI Report Server, which follows that server's release schedule rather than the monthly one. It is a different download, and it can sit alongside the standard version. Install it only if your workplace actually uses Report Server, and if nobody has mentioned Report Server to you, they do not.

## 4. What to do on a Mac

There is no Mac version of Power BI Desktop, and there is no sign of one. That is a real limitation rather than something to work around cleverly, so here are the honest options.

The **Power BI service** runs in any modern browser, on any operating system. You can view reports, build simple visuals, and work with data that is already published. What you cannot do in the browser is the full modelling work: complex DAX authoring and Power Query transformations belong to Desktop.

Beyond that, the routes are running Windows on the Mac through virtualisation software, or using a Windows machine remotely. Both work and both cost either money or convenience. If your goal is learning the concepts rather than a specific employer's file, consider whether [Tableau Public](https://michaelnocito.github.io/analyst-prep-kit/guides/install-tableau-public/), which runs natively on macOS, is a better use of your next month.

## 5. First launch, and the sign-in question

Power BI Desktop opens on a welcome screen with a sign-in prompt. Say whether you think you need an account to continue, before reading on.

You do not, for the part you are here to learn. You can close that screen and build reports locally, connect to files and databases, write DAX, and save `.pbix` files, all without signing in. Signing in is what lets you **publish** to the Power BI service and share with colleagues.

That distinction saves people a lot of frustration, because a personal email address will usually be rejected by the sign-up: the free account is aimed at work or school accounts. If you are learning at home and have no such account, nothing on the learning path is blocked. Build locally, and worry about publishing when you have somewhere to publish to.

## 6. Load a file and prove it works

An install is finished when a chart appears, not when the installer closes. Three steps.

**Get data.** On the Home ribbon, choose Excel workbook or Text/CSV and pick a file. If you have none to hand, [a free dataset](https://michaelnocito.github.io/analyst-prep-kit/guides/free-datasets-to-practice-with/) is one download away. In the Navigator, tick your table and choose **Transform data** rather than Load, so you land in the Power Query editor.

**Check the column types.** Each column header carries a small symbol saying what Power BI thinks it holds: `ABC` for text, `123` for whole numbers, a calendar for dates. Fix any that are wrong here, in the editor, because these steps are recorded and replay every time the data refreshes. Then press Close & Apply.

**Make one visual.** Click a bar chart in the Visualizations pane, drag a text column into Y axis and a number column into X axis. A chart appears. That is the loop the whole tool is built on, and everything else is a refinement of it.

Save the file. It is a `.pbix`, and it contains the report, the data model, and a copy of the data itself, which is why these files get large quickly.

## 7. The monthly update, and the file-version trap

Microsoft releases a new Power BI Desktop every month and supports only the latest version. If you contact support on an older one, the first instruction is to upgrade.

That cadence has a consequence worth planning for: **a file saved in a newer version cannot be opened by an older one.** On a team, that turns into a real problem the day one person updates and the rest have not, because their copies of the shared file simply stop opening. The fix is agreement rather than technology. Either everyone updates on the same schedule, or the team pins one version deliberately using the archive of previous releases.

Now picture the last shared file in your workplace that people opened in different versions of some tool. Who found out first that the versions had drifted, and how? It is almost always the person who did nothing wrong, which is the argument for deciding this before it happens.

## The full before and after

Same goal both times: Power BI Desktop working on a work laptop.

### Before
    
    
    Searched, found the Download Center link
    Downloaded PBIDesktopSetup_x64.exe
    Ran it → "administrator credentials required"
    Raised an IT ticket
    Waited three days

Nothing here is a mistake, and it is the most common path because the Download Center is what a search engine offers first. The blocker arrives at the last step, after the download, which is the most discouraging place for it to appear.

### After
    
    
    Checked the display resolution first (1600x900 or better)
    Microsoft Store → search "Power BI Desktop" → Install
    No admin prompt
    Opened it, closed the sign-in screen
    Get data → CSV → Transform data → fixed one date column → Close & Apply
    Dragged one bar chart

Same software, no ticket, and it now keeps itself current. The one added step at the front, checking the screen, is there because it is the requirement people fail without an error message that says so.

## What goes wrong, and the fix

Six that account for most of it.

**The installer asks for an administrator password.** That is the direct download. Use the Microsoft Store version instead, which does not require one.

**You cannot close the startup screen.** Your resolution is below the supported minimum, so the button is drawn off-screen. Raise the resolution, or reduce Windows text scaling to 100% in Settings, System, Display.

**A dialog you need never appears.** Same cause: display scaling above 100%. Set it back to 100%, restart the app, complete the dialog.

**"Microsoft Edge can't read and write to its data directory."** Power BI Desktop is running under a system account, which WebView2 does not support. Run it as your own user.

**A colleague cannot open your file.** They are on an older version. Newer files do not open in older releases. Agree a version across the team.

**It will not run in your remote desktop environment.** Microsoft supports Azure Virtual Desktop and Windows 365. Citrix VDI and other virtual desktops are not supported, and neither is running it as a published virtualised application.

## Why it is built this way

The two install routes are not redundancy, they are two different customers. The Store package is sandboxed and per-user, which is exactly why it needs no administrator rights and why it cannot inherit settings from a machine-wide installation. The executable writes into shared locations for every user on the machine, which is why it demands elevation and why it accepts command-line switches for unattended deployment. Once you see that, the whole list of differences follows from one design decision rather than being a set of arbitrary quirks.

The monthly cadence explains the rest. A tool that ships every month and stays in step with a cloud service cannot also promise that old versions read new files, because the file format carries the new features. Supporting only the latest version is the cost of that pace, and pinning a version for a team is the legitimate escape hatch rather than a workaround.

One note on the way this page is written. It kept asking you to commit to an answer, whether memory or screen stops more people, whether you need an account, before giving one. Attempting an answer before seeing the correct one reliably improves how well the correct one is retained, even when the attempt is wrong (Bisra, Liu, Nesbit, Salimi, & Winne, 2018, _Educational Psychology Review_ , 30(3), 703–725).

## Using this on your own machine

Five steps, in order.

  1. **Check the display resolution before anything else.** It is the requirement that fails without saying so.
  2. **Install from the Store** unless you need a pinned version or the Store is blocked. No admin, automatic updates.
  3. **Skip the sign-in** while you are learning. Everything except publishing works without it.
  4. **Do type fixes in Power Query** , before Close & Apply, so they replay on every refresh instead of being redone by hand.
  5. **Agree a version with anyone you share files with** , on the day you start sharing, not the day it breaks.

If you have paper nearby, one optional drawing is worth two minutes. Draw the two routes from the picture at the top and mark, on your own machine, which gates you can open: administrator rights, Store access, screen size. The route with no gates on it is your route, and that decision takes thirty seconds once it is drawn.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): getting set up, SQL, Excel, Python, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                   | What it is, or what it does                                              |
|-------------------------|--------------------------------------------------------------------------|
| Microsoft Store install | No admin rights, updates itself, smaller updates, all languages.         |
| Direct download         | Requires administrator. Use for pinned versions or a blocked Store.      |
| Operating system        | Windows 10 or Server 2016 and later. No macOS build exists.              |
| 32-bit                  | No longer supported. Take the 64-bit build.                              |
| Display minimum         | 1440x900 or 1600x900. Below that, controls sit off-screen.               |
| Text scaling above 100% | Hides dialogs you must interact with. Set it back to 100%.               |
| .NET and WebView2       | .NET 4.7.2 or later. WebView2 normally installs alongside.               |
| Sign-in                 | Only needed to publish. Building locally needs no account.               |
| Personal email          | Usually rejected at sign-up. Work or school accounts are the target.     |
| Monthly release         | Only the latest version is supported.                                    |
| Version trap            | Files saved in a newer version will not open in an older one.            |
| Side-by-side            | Store version and the old installer version together is not supported.   |
| Report Server build     | A separate download on its own schedule. Only if your workplace uses it. |
| Virtual desktops        | Azure Virtual Desktop and Windows 365 supported. Citrix VDI is not.      |
| .pbix                   | Report, model and a copy of the data in one file. They get large.        |
| Mac route               | Power BI service in a browser. No full modelling or Power Query there.   |

**The one habit to keep.** Fix data types in Power Query before Close & Apply, never afterwards in the report. Steps recorded there replay on every refresh, and anything you fix by hand has to be fixed by hand again forever. If something breaks in a way this page does not cover, there is a general [diagnosis loop for being stuck](https://michaelnocito.github.io/analyst-prep-kit/guides/technical-tenacity/).

One last thought, and I would genuinely like other people's answers. The install problem I remember best was not a missing file, it was a button drawn just past the bottom edge of a small laptop screen, so the software was working perfectly and completely unusable. What turned out to be the cause the last time a tool would not start for you?

## References

  * Bisra, K., Liu, Q., Nesbit, J. C., Salimi, F., & Winne, P. H. (2018). Inducing self-explanation: A meta-analysis. _Educational Psychology Review_ , 30(3), 703–725.
  * Microsoft. Download Power BI Desktop. Retrieved 8 August 2026 from learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop. Cited for install routes, system requirements and support limits, which are product details rather than research findings.

---

*Originally published on Analyst Prep Kit: [How to Install Power BI Desktop (Including on a Locked-Down Work Laptop)](https://michaelnocito.github.io/analyst-prep-kit/guides/install-power-bi-desktop/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
