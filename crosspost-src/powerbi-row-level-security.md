By the end of this page you can set up row-level security, and, more usefully, predict what any given person will actually see before they open the report. You will know the one setting that switches the whole thing off without any warning, why adding somebody to a second role gives them more data rather than less, and what the built-in test proves and what it quietly does not. It takes about twenty-five minutes. Every number below is printed next to the arithmetic that produced it.

Here is the move. You write a rule in Power BI Desktop under **Modeling › Manage roles** , something like `[Region] = "East"`. You publish. Then you go to the Power BI Service, open the semantic model's **Security** page, and add people to that role. Two tools, two steps, and skipping the second one is the most common reason RLS appears to do nothing.

The short version: a role is a filter that answers TRUE or FALSE for every row, and rows that answer FALSE are removed. Whether it binds a particular person depends on their workspace role, not on the filter.

That second sentence is where almost all the damage lives, so it gets the picture.

> _The original carries a diagram here. In words: On the left is a tall stack of sixteen identical narrow bars, drawn in outline, standing for every row in the model. Two routes lead away from that stack to the right. The upper route runs into a funnel, wide where it enters and narrow where it leaves, and comes out the far side as a short stack of only four solid bars, marked Viewer. The lower route leaves the same stack, curves underneath the funnel without touching it, and arrives on the right as a full stack of all sixteen solid bars, marked Admin, Member, Contributor. Same model, same rule, same starting rows. The only difference between the two routes is whether they meet the funnel at all, and the route that misses it delivers everything._

**Every number on this page is checkable.** It runs on the sixteen-order fixture used across these Power BI guides, and every total is printed beside its arithmetic. Every behavior described is quoted from Microsoft's own documentation in the "why this works" section rather than inferred, because this is the one topic on the site where being approximately right is the same as being wrong.

**Orders** , the fact table, with revenue already worked out per line. Sixteen rows, four regions.

| OrderID | Region | Product | Units | Revenue |
|---------|--------|---------|-------|---------|
| 1001    | North  | Desk    | 4     | 880     |
| 1002    | South  | Chair   | 10    | 850     |
| 1003    | East   | Desk    | 3     | 660     |
| 1004    | North  | Lamp    | 6     | 240     |
| 1005    | South  | Desk    | 3     | 660     |
| 1006    | East   | Chair   | 8     | 680     |
| 1007    | North  | Chair   | 5     | 425     |
| 1008    | West   | Lamp    | 12    | 480     |
| 1009    | South  | Lamp    | 7     | 280     |
| 1010    | East   | Desk    | 5     | 1,100   |
| 1011    | North  | Desk    | 2     | 440     |
| 1012    | West   | Chair   | 9     | 765     |
| 1013    | East   | Lamp    | 15    | 600     |
| 1014    | North  | Chair   | 6     | 510     |
| 1015    | South  | Desk    | 4     | 880     |
| 1016    | West   | Desk    | 2     | 440     |

Four regional totals, and they are the four numbers the rest of the page checks against.

| Region  | Orders | Revenue   | Arithmetic                     |
|---------|--------|-----------|--------------------------------|
| North   | 5      | 2,495     | 880 + 240 + 425 + 440 + 510    |
| South   | 4      | 2,670     | 850 + 660 + 280 + 880          |
| East    | 4      | 3,040     | 660 + 680 + 1,100 + 600        |
| West    | 3      | 1,685     | 480 + 765 + 440                |
| **All** | **16** | **9,890** |  2,495 + 2,670 + 3,040 + 1,685 |

## 1. The fork: can this person edit the model, or only read it?

Before the explanation, one question worth answering from memory. Think of the last Power BI report you shared with somebody. Say whether that person could open the underlying model and change a measure, or whether they could only look at what you built.

That question, not the rule you wrote, decides whether row-level security does anything at all. There are two answers.

**Answer one: they can only read.** Their workspace role is Viewer, or they got the report through a published app. If that is true, every rule you wrote runs against every query they make, and they see only the rows their role permits.

**Answer two: they can edit.** Their workspace role is Admin, Member or Contributor. If that is true, row-level security does not apply to them at all. Not partially, not with a warning. They see every row in the model, and the report gives them no sign that a rule exists.

What decides between them is a dropdown in the workspace access panel, which is usually set by whoever added the person, often months earlier, and usually not by whoever wrote the security rule. That gap between the two decisions is where this fails.

It matters because the failure is silent on both sides. The person seeing too much has no idea, and the person who built the model tested it and watched it work.

## 2. What a role actually is

A role is a name plus one or more filters, and each filter is attached to a table. The filter is a DAX expression that gets asked about every single row and has to answer TRUE or FALSE. Microsoft's wording is worth having exactly: "A DAX filter evaluates TRUE/FALSE for each row. Only rows that return TRUE are visible. Everything else is completely removed."

Completely removed is the part to hold on to. This is not a report filter that a user can clear, and it is not a default someone can override in the Filters pane. The rows are gone before the visual is drawn.

The simplest useful rule, typed into the DAX editor under Modeling › Manage roles, is a comparison:
    
    
    [Region] = "East"

Say out loud what that returns for order 1004, which is a North lamp. FALSE, so the row is dropped. Order 1013 is an East lamp, so TRUE, so the row stays. Sixteen questions, four answers of TRUE, and the model an East role member queries has four rows in Orders and totals 3,040.

One naming rule that catches people, and it is documented rather than folklore: a role name cannot contain a comma. `London,ParisRole` is rejected.

Filters land on one table and then travel. RLS filters propagate through the model's relationships the same way any other filter does, which is why it is usually better to put the rule on a small dimension table and let it flow to the fact table. That is one more argument for a proper [star schema](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-star-schema/), and Microsoft's guidance says so directly: "it's often more efficient to enforce RLS filters on dimension tables, and not fact tables."

## 3. Two tools, two steps: where roles live and where people do

This trips up more exam candidates than any other part of the topic, and the reason is that the job is split across two different products.

| Step                | Where                  | What you do                                                                                         |
|---------------------|------------------------|-----------------------------------------------------------------------------------------------------|
| 1. Define the role | Power BI Desktop       | Modeling › Manage roles. Name it, pick a table, write the DAX filter.                               |
| 2. Publish         | Desktop to the Service | The role definitions travel with the model. The membership does not, because it does not exist yet. |
| 3. Assign people   | Power BI Service       | Semantic model › Security. Add users or security groups to each role.                               |
| 4. Validate        | Either                 | View As in Desktop, or Test as role in the Service.                                                 |

You cannot assign users to a role in Desktop. The option is not hidden or buried, it is not there, because Desktop has no idea who is in your organization. And the Security page in the Service only appears for models that already have roles defined, so a model with no roles gives you nothing to click and no explanation.

Two smaller facts that come up. Only the semantic model's owner or a workspace admin can add members to roles. And Microsoft 365 groups cannot be used for role membership at all; security groups, distribution groups and mail-enabled groups can.

Anyone who has published a model but not assigned anybody gets the outcome that looks like a bug and is not. A user in no role at all typically sees nothing rather than everything, because the rule is enforced and no role permits any row.

## 4. The failure: the East manager who sees 9,890

Here it is worked end to end, and it is the version that actually happens.

Priya runs the East region. You build the model, write `[Region] = "East"` into a role called East, publish it, add Priya to the role in the Service, and test it. The test passes: four orders, 3,040.

Some weeks earlier, though, Priya was added to the workspace so she could open the other three reports the team keeps there. She was given **Member**. Nobody connected the two decisions, because they were made by different people for different reasons on different days.

Priya opens her regional card. It reads **9,890**.

| What was intended           | What she sees             | Gap                   |
|-----------------------------|---------------------------|-----------------------|
| 3,040, the four East orders | 9,890, all sixteen orders | 6,850 (9,890 − 3,040) |

Before reading on, say why the report gives her no clue. The rule is still there, the role is still assigned, and she is still a member of it.

Because there is nothing to show. RLS does not grey anything out or add a banner. It removes rows before the query returns, so a report with no rows removed is identical to a report that never had a rule. Priya's card is not displaying an error. It is displaying the correct total for the rows she was given, and she was given all of them.

The fix is one dropdown, and it is not in the model. In the workspace access panel, change Priya from Member to **Viewer**. She keeps the reports, loses nothing she uses, and the rule starts running. If she needs to build her own reports on top of the model, give her Viewer plus Build permission on the semantic model, because RLS still applies to Viewers who have Build. Microsoft states that case explicitly, including for Analyze in Excel.

Now picture this on a workspace you actually own. Open the access list and read the roles rather than the names. Say out loud how many people on it could edit, and whether every one of them is supposed to see every row. That count is the real scope of your security rule.

## 5. Two roles is a union, not an intersection

Before the explanation, a prediction. Somebody is in a role that permits East, and you also add them to a role that permits lamps. Say whether they end up seeing East lamps only, or something larger.

Something larger, and it is the answer most people get wrong because every other permission system they have used behaves the other way.

Microsoft's guidance is unambiguous: "When a report user is assigned to multiple roles, RLS filters become additive. It means report users can see table rows that represent the union of those filters." And the sentence right after it is the one to memorize, because it names the assumption being broken: "unlike permissions applied to SQL Server database objects (and other permission models), the 'once denied always denied' principle doesn't apply."

Worked on the fixture. The East role permits orders 1003, 1006, 1010 and 1013. A Lamps role permits every lamp order, which is 1004, 1008, 1009 and 1013.

| What you get                 | Orders                 | Revenue   | Arithmetic                                 |
|------------------------------|------------------------|-----------|--------------------------------------------|
| East role alone              | 1003, 1006, 1010, 1013 | 3,040     | 660 + 680 + 1,100 + 600                    |
| Lamps role alone             | 1004, 1008, 1009, 1013 | 1,600     | 240 + 480 + 280 + 600                      |
| What people expect from both | 1013                   | 600       | The one East lamp                          |
| **What both actually give**  | **seven orders**       | **4,040** |  660 + 240 + 680 + 480 + 280 + 1,100 + 600 |

Expected 600, delivered 4,040, and 4,040 minus 600 = 3,440 of rows nobody meant to hand over. Adding a second role widened the access, which is the opposite of what "adding a restriction" sounds like.

Microsoft's own illustration of this is starker than mine and worth keeping in your head as the extreme case. A Workers role restricts a Payroll table with the rule `FALSE()`, so it returns no rows at all. A Managers role uses `TRUE()`, so it returns everything. Somebody who maps to both roles sees the entire Payroll table. The deny does not win. There is no deny.

The fix is a design rule rather than a setting: **one person, one role**. If a person needs East and lamps together, build a single role that carries both filters, one on each table, so both conditions apply at once. Microsoft's guidance recommends exactly this, and the reason it gives is worth noting: a user can end up in a second role indirectly, through a security group, without anybody deciding to put them there.

## 6. Dynamic RLS, and the typo that opens the whole table

Writing one role per region does not scale past a handful. Dynamic RLS is one role for everybody, where the rule compares a column to whoever is signed in.

You need a small mapping table, one row per person, with their sign-in address and what they are allowed to see. Then the rule goes on that table:
    
    
    [UserEmail] = USERPRINCIPALNAME()

USERPRINCIPALNAME takes no arguments and returns the user principal name at connection time, which looks like an email address. The filter lands on the mapping table, the mapping table is related to the region, and the filter travels down that relationship to Orders. One role, one rule, and adding a new manager becomes a row in a table rather than a change to the model.

There is an older function, USERNAME, and the difference is a real trap rather than trivia. In Power BI Desktop, USERNAME returns `DOMAIN\User`. In the Power BI Service, USERNAME and USERPRINCIPALNAME both return the user principal name. So a rule built and tested against a domain-style value in Desktop can behave differently once published. Use USERPRINCIPALNAME and store matching values in the mapping table.

Now the part worth the whole section. This pattern, which reads perfectly sensibly, hands over the entire table to a typo:
    
    
    IF (
        USERNAME () = "Worker",
        [Type] = "Internal",
        TRUE ()
    )

Workers see internal rows. Everybody else, meaning managers, sees everything. But "everybody else" is not a list of managers. It is every value that is not exactly the string `Worker`, so `Wrker` falls into the else branch and returns TRUE for every row. Microsoft's guidance uses this exact example, and its fix is to test for each expected value and make the fall-through deny:
    
    
    IF (
        USERNAME () = "Worker",
        [Type] = "Internal",
        IF (
            USERNAME () = "Manager",
            TRUE (),
            FALSE ()
        )
    )

The habit underneath it: in a security rule, the last branch is the one that runs when you have not thought of the case. Make it return nothing.

## 7. What View As proves, and what it does not

Desktop has View As on the Modeling ribbon, and the Service has Test as role on the model's Security page. Both are genuinely useful and both prove less than people think.

What they prove: your DAX filter is valid, it lands on the table you meant, and it propagates through the relationships you expect. That is most of the work, and testing every role this way is not optional.

What they do not prove, and this is documented rather than folklore:

  * **They cannot tell you a person's workspace role.** The whole failure in section 4 is invisible to both tools, because both simulate the rule and neither simulates the bypass.
  * **For dynamic RLS, the test uses your own identity.** USERPRINCIPALNAME returns your sign-in name, not the one you are trying to simulate. So a passing test tells you the rule works for you.
  * **Not every surface is covered.** Test as role does not work for paginated reports, and it does not validate Q&A visuals, Quick insights or Copilot. It also does not work for DirectQuery models with single sign-on.

The test that closes the gap is unglamorous and takes two minutes: put a card on the report showing `USERPRINCIPALNAME()`, publish, and have one real person in each audience open it and tell you what it says next to their totals. Microsoft's troubleshooting guidance suggests the same measure, named something like "Who Am I". A real user's session is the only thing that exercises both halves at once.

## 8. Four things RLS does not do

Each of these is somebody's disappointed afternoon.

**It does not hide columns or measures.** Microsoft is direct about it: RLS "filters table rows. They can't be configured to restrict access to model objects, including tables, columns, or measures." If a person can see a row, they can see every column on that row, salary included. The feature for hiding a column is object-level security, and it is separate.

**It does not let people see a total without the detail.** Asked whether RLS can hide detailed rows while still showing them in a summary, the answer is no: you secure rows, and users can see either the details or the summary of what they have. Getting a company-wide total next to a personal one needs a separate summary table built for that purpose, not a cleverer rule.

**It cannot be overridden by DAX, in either direction.** This one cuts both ways and is worth knowing. No measure can escape RLS, and Microsoft goes further: a DAX expression "can't even determine that RLS is enforced". So there is no writing a smarter measure to work around it, and equally no accidentally punching a hole in it with ALL or REMOVEFILTERS. If you want the mechanics of what a measure can and cannot see, that is [CALCULATE and filter context](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-calculate/).

**It does not follow the model everywhere.** Live connections to Analysis Services enforce security in that model rather than in Power BI, and the Security option does not even appear. Publish to web does not work with RLS at all. Service principals cannot be added to a role, so an app authenticating that way is not filtered by one.

## The full before and after

Same model, same rule, same person. One dropdown apart.

|                                 | Before: Priya is a workspace Member | After: Priya is a Viewer                   |
|---------------------------------|-------------------------------------|--------------------------------------------|
| Role exists in the model        | Yes                                 | Yes                                        |
| Priya is assigned to it         | Yes                                 | Yes                                        |
| View As in Desktop              | Passes, shows 3,040                 | Passes, shows 3,040                        |
| Test as role in the Service     | Passes, shows 3,040                 | Passes, shows 3,040                        |
| What Priya actually sees        | 9,890, all sixteen orders           | 3,040, her four orders                     |
| Can she still open the reports  | Yes                                 | Yes                                        |
| Can she still build her own     | Yes                                 | Yes, with Build permission, still filtered |
| Anything on screen that says so | No                                  | No                                         |

The last two lines are the point of the page. Every test you can run from your own desk passes in both columns.

## Edge cases that return the wrong rows quietly

These produce data rather than an error, which is the only kind that matters here.

  * **An inactive relationship.** RLS filters only travel along active relationships. A model with a second, inactive date relationship will not carry the security filter down it, so a visual built on that path can show rows the role never permitted.
  * **A bi-directional relationship you assumed was enough.** Security filtering runs one way by default, whether or not the relationship itself is bi-directional. Propagating security both ways is a separate checkbox on the relationship, "Apply security filter in both directions", and it is off until you tick it.
  * **A user in a security group you forgot about.** The second role does not have to be assigned deliberately. Group membership puts people into roles, roles are additive, and the resulting access is the union.
  * **A changed name.** Dynamic RLS matches a stored string against a live sign-in name. Somebody's account changes and their row stops matching, so they abruptly see nothing, and it looks like an outage rather than a mapping problem.
  * **An import model whose source already has security.** Importing does not bring the source's security rules with it: on import you must define RLS in Power BI. With DirectQuery the source's own rules apply, which is a genuinely different arrangement to reason about.
  * **A calculated column doing the filtering job.** Rules belong in the role. Building the same logic into a column and hoping it filters is a category error, and which of the two you should be writing is decided in [calculated column vs measure](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-measures-vs-columns/).

## Why this works

The design reason for the bypass is defensible once you say it plainly: people who can edit the model can already see the data, because editing a model means reading it. A Contributor can open the semantic model, write their own measure and read any number in it. Filtering their report while leaving the model open to them would be a lock on a door with no wall attached. Microsoft states the boundary in one line: "RLS only restricts data access for users with Viewer permissions. It doesn't apply to workspace Admin, Member, or Contributor roles."

So the control is real, and its scope is a workspace role. That makes this an instance of the oldest rule in the field. Saltzer and Schroeder set out eight design principles for protecting information, and the one this page keeps running into is least privilege: every user should operate with the smallest set of privileges the job needs (Saltzer & Schroeder, 1975, _Proceedings of the IEEE_ , 63(9), 1278–1308). Priya was given edit rights so she could read four reports. The extra privilege was not the point of the decision and it silently outranked the security rule.

Their other principle worth naming here is fail-safe defaults: base access on permission rather than exclusion, so the default outcome is no access. That is exactly the shape of the additive-roles behavior. A rule returning FALSE grants nothing; it does not deny. Union it with a rule that grants everything and everything is what you get, which is why the fix is one role per person rather than a carefully layered stack of them.

One note on the cheat sheet below. It is built to be covered and recalled rather than read, because testing yourself on material transfers to new situations better than restudying it, which matters here since you will be applying this to workspaces that look nothing like the one above (Butler, 2010, _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133).

## Using this on your own model

Auditing every role in an inherited tenant is miserable and you will stop at the second workspace. Do this instead, in order.

  1. **Open the workspace access list before you open the model.** Read the roles, not the names. Everyone listed as Admin, Member or Contributor sees every row, whatever your rules say. That list is the answer to "who can see everything", and it takes thirty seconds.
  2. **Move every consumer to Viewer.** If somebody needs to build on the model, Viewer plus Build permission does that and stays filtered. Editing rights are for people who edit.
  3. **Count roles per person, not people per role.** Anybody in two roles is getting the union. Expand the security groups, because that is where the second role hides.
  4. **Read the last branch of every dynamic rule.** If the fall-through is TRUE, an unexpected sign-in name returns the whole table. Make it FALSE and test with a value you know is wrong.
  5. **Publish a "Who am I" card.** One card with `USERPRINCIPALNAME()` next to the totals, and one real person from each audience telling you what it says. This is the only test that covers the workspace role and the rule at the same time.
  6. **Write down who each role is for.** One sentence per role, stored with the model. Roles outlive the person who wrote them, and a role nobody can explain is a role nobody will dare remove.

If you have paper nearby, one optional sketch makes the additive rule stick. Draw two overlapping circles, label one East and one Lamps, and shade the small piece where they overlap. That is what most people expect two roles to give. Now shade both whole circles. That is what two roles actually give. You will not get this one wrong again.

**More detail on this, and more like it.** Every how-to sits in one place on the [guides index](https://michaelnocito.github.io/analyst-prep-kit/guides/): Power BI, SQL, Excel, and the working habits around them.

## The whole thing on one screen

This is the retrieval sheet. Cover the right column, work down the left, and say each answer out loud before you check it.

| Thing                         | What it does                                                                         |
|-------------------------------|--------------------------------------------------------------------------------------|
| What a role is                | A DAX filter asked of every row. TRUE stays, FALSE is removed completely.            |
| Where roles are defined       | Power BI Desktop, Modeling › Manage roles.                                           |
| Where members are assigned    | The Power BI Service, semantic model › Security. Never in Desktop.                   |
| Who RLS applies to            | Viewers, and app consumers. That is the whole list.                                  |
| Who it does not apply to      | Workspace Admin, Member and Contributor. By design, with no warning.                 |
| Viewer plus Build             | Still filtered, including through Analyze in Excel.                                  |
| Two roles                     | A union. More data, not less. "Once denied always denied" does not apply.            |
| The design rule               | One person, one role. Put both filters in the same role instead.                     |
| A user in no role             | Usually sees nothing, because no role permits any row.                               |
| Static rule                   | `[Region] = "East"`                                                                  |
| Dynamic rule                  | `[UserEmail] = USERPRINCIPALNAME()`, against a mapping table.                        |
| USERNAME vs USERPRINCIPALNAME | In Desktop USERNAME gives DOMAIN\User. In the Service both give the UPN.             |
| The dangerous else            | A fall-through of TRUE hands the table to any typo. End on FALSE.                    |
| What View As proves           | The rule and its propagation. Not the workspace role, not another person's identity. |
| Filter propagation            | Active relationships only. Security both ways is a separate checkbox.                |
| Where to put the rule         | On the dimension table, and let it flow to the fact table.                           |
| What RLS cannot hide          | Columns and measures. That is object-level security.                                 |
| Role names                    | No commas allowed.                                                                   |

**The one habit to keep.** Read the workspace access list before you trust the rule. Anyone on it above Viewer sees every row, and no amount of correct DAX changes that. It is the first thing to check and the last thing anyone thinks of, and it takes thirty seconds.

One last thought, and I would genuinely like other people's answers. The version of this I found hardest to explain afterwards was a model where the rules were perfect and three people had been added to the workspace as Contributors during a handover, for two weeks, eighteen months earlier. Nobody had taken them out and nobody had noticed, because nothing about the reports looked different. What is the longest one of these has been open in a tenant you inherited?

## References

  * Saltzer, J. H., & Schroeder, M. D. (1975). The protection of information in computer systems. _Proceedings of the IEEE_ , 63(9), 1278–1308.
  * Butler, A. C. (2010). Repeated testing produces superior transfer of learning relative to repeated studying. _Journal of Experimental Psychology: Learning, Memory, and Cognition_ , 36(5), 1118–1133.
  * Microsoft. Row-level security (RLS) with Power BI, and Row-level security (RLS) guidance in Power BI Desktop, and USERPRINCIPALNAME function (DAX). Microsoft Learn. All quotations above are taken from these pages.

---

*Originally published on Analyst Prep Kit: [Row-Level Security in Power BI: Who Gets Filtered and Who Does Not](https://michaelnocito.github.io/analyst-prep-kit/guides/powerbi-row-level-security/)*

*Visit the site for more beginner data analysis guides and free resources: [the full guide archive](https://michaelnocito.github.io/analyst-prep-kit/guides/) covers SQL, Excel, Power BI, Tableau, Python and statistics, and the [practice kits](https://michaelnocito.github.io/analyst-prep-kit/) run in your browser with nothing to install.*

*If it was useful: [Buy Me a Coffee](https://buymeacoffee.com/michaelnocito).*
