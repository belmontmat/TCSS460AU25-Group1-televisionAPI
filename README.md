# TCSS460 Group 1 TV Database

> **University of Washington Tacoma**
>
> **School of Engineering and Technology**
>
> **Computer Science and Systems**
>
> **TCSS 460 A - Client/Server Programming for Internet Applications**
>
> **AU2025**
>

---
## Contents
* [Alpha Sprint 1](#alpha-sprint-1)
* [Beta Sprint 2](#beta-sprint-2-week-3---october-13---october-19)
* [Beta Sprint 3](#beta-sprint-3-week-4---october-20---october-26)
* [Production Sprint 4](#production-sprint-4-week-5---october-27---november-2)

---


# Alpha Sprint 1 (Week 2 - October 6 - October 12)
Initial setup and planning. Setup the GitHub repository, drafted
ideas on how the API will work and summarized them in a functionality
document. Drafted an ER diagram and some initialization scripts. Performed research on cloud platforms was performed as well. All of these materials can
be found in /project_files.

## Contributions

* Mathew: Created the GitHub repo and GitHub Projects board.
Synthesized potential endpoint formats from our initial
project brainstorm and helped refine ideas for the functions of
the API. Performed research on AWS platforms.
* Preston: Put together meeting itineraries, performed research
on Google Cloud, drafted the database ER diagram and generated
an initialization script using Claude.
* Sean: Helped build a refined functionality document to describe
our API, performed research on Heroku, generated a Swagger YAML.
* Abdul: Performed research on Microsoft Azure, helped refine
the functionality document.

## Meeting Summary
Group 1 met virtually through Discord on Thursday and Saturday to discuss the
initial planning of our API and discuss cloud providers respectively. We also
worked asynchronously on the YAML file on Sunday.

## Sprint Comments and Concerns
Preston - I created an initialization script (by putting my ER diagram
through Claude) which creates just the tables. I asked it how I could
migrate the table over and after some back and forth, it spit out a JavaScript
file to use through Node. At this point I don't know if this script will work
and will probably have to return to this at a later point.

As a general note, we may take need an additional day to refine how the API will
work (hence our Swagger documentation might not be completely polished as
of this sprint's submission deadline).

# Beta Sprint 2 (Week 3 - October 13 - October 19)

This week we got our Express app and Postgres database hosted on Render: https://g1-tvapi.onrender.com/api-docs/.

## Contributions
* Mathew: Set up the /api-docs endpont and managed the swagger docs as the endpoint designs came together. Led during Sunday peer programing session. Scrum Master.
* Preston: Got the API App and Express Router up. Helped during the peer programming session specifically with database initialization, SQL querries, controller/route design, and utilities.
* Sean: Got the API and database hosted on Render. Helped during Sunday peer programming session specifically with postman tests.
* Abdul: No contribution

## Meeting Summary
### Meeting 1
Monday: 11:00 am, this was our planned initial scrum meeting. We made brief issues in our github project kanban board but these were mostly changed one the PRD was updated.

### Meeting 2
Thursday 12:30 pm, Scrum master had already updated and created issues to for new requirements. Assigned initial tasks out

### Meeting 3
Sunday 9:30 am, Sean and Preston arrived on time and began setting up Render. Mat arrived at 11 am to begin helping with route design and SQL querries. Mat and Sean stayed behind a while longer to work on postman tests.

## Sprint Comments and Concerns
Render has a 30 day postgres limit so we are planning on swapping to Heroku. Unfortunately, we've had trouble with getting credits from github.

# Beta Sprint 3 (Week 4 - October 20 - October 26)
API web address (still the same): https://g1-tvapi.onrender.com/api-docs/

This week we added the rest of the routes from our design docs. During implementation schemas, data types, route params, and routes themselves were changed to work better with shared interfaces. We also added Api key requirements to our protected routes.

## Contributions
* Mathew: Implemented genres, shows, and stats routes. Refactored common code into utility functions.
* Preston: Implemented actors and admin routes. Fixed database deficiencies
* Sean: Implemented API-Keys, including updating the db.
* Abdul: No contribution

## Meeting Summary
Note: Due to the AWS/Canvas outage, we skipped our Monday morning meeting and did not reschedule due to time conflicts.

### Meeting 1
10-23-25
Discussed Mathew's PR, changes to the structure
Discussed API key database
Handed out route tasks
How much of API keys implementation do we need?
Eventually will work on tests, update documents for this week

### Meeting 2
10-26-25
Knocked out merge conflicts and combined all our work

## Sprint Comments and Concerns
 * Render has a 30 day postgres limit so we are planning on swapping to supabase.
 * We had Claude write our tests, but some of the tests our out of date due to minor refinements in our API documentation that Claude didn't account for. These will have to be updated. We also noticed a few tests that don't pass which we are investigating.


# Production Sprint 4 (Week 5 - October 27 - November 2)
API web address: https://g1-tvapi.onrender.com/api-docs/
Credentials API: https://g1-authcore-0fdbad45b289.herokuapp.com/

This week we continued refining tests and fixes for the data API and got the credentialing API onto Heroku.

## Contributions
* Mathew: Implemented validation middleware for the authentication routes, refactored the data API code and secured our SQL queries. Fixed the statistics routes and corresponding documentation.
* Preston: Set the API key middleware to function on all data routes, hosted credentials API and DB onto Heroku, refined Postman tests with cleanup functionality and repaired endpoints that were out of compliance with the API docs.
* Sean: Implemented the credentials admin routes, created postman tests for the new shows routes from last sprint.
* Abdul: No contribution

## Meeting Summary
### Meeting 1
2025-10-27

Weekly scrum, review of this week's deliverables and assignments to contributors.

### Meeting 2
2025-10-30

Discussed each other's status with refining tests - most ran out of tokens. Clarified requirements for the credentialing API.
Discussed specifics for Heroku, middleware and admin routes.

### Meeting 3
2025-11-02

Fixed placement of API key middleware, finished tests and ensured compliance with documentation.

## Sprint Comments and Concerns
Nothing to add.
