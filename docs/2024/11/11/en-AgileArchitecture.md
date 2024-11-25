# Agile Architecture

The word *agile* means "able to move quickly and easily". The [Agile Manifesto](https://agilemanifesto.org) proposes principles for managing software-development in and agile way (as an alternative to the waterfall-like project-management approach borrowed from other disci­plines that was used before).

The core of all methods designed to support an agile approach is to work iteratively in small increments:

* Think of the smallest activity that could produce something useful
* Do it
* Check whether it worked out
    * If it did, build on it
    * If it didn't, learn from it and do something else
* Repeat

Evolutionary Architecture proposes to work iteratively with the software architecture (both writing the architecture that we aim for and explicating the current architecture of the system).

While working iteratively, feedback is crucial. We ask end users, developers, product owners, infrastructure specialists, buyers, sales people, and maybe even once in a while a director: "what aspect of the system is least optimal". We organise this feedback in an architectural debt backlog. Based on this backlog, we formulate ideas to improve on these issues ans we organise these ideas in an architecture improvement backlog. Each sprint we work on a limited number of these ideas. After implementing each idea, we ask for new feedback — something should have improved — and update both backlogs.

In the book *Extreme Programming* [Beck2004](#!bib@bibliography.json) the observation is made that software development is like driving a car. There is no perfect position of the steering wheel. Not even on a straight road. We use the wheel to make small corrections in such a way that we can stay on the route as long as we like and can take an exit whenever we want to. The same observation is true for software architecture. Making small corrections we show the current architecture more clearly, we align the principles and guidelines that we would like to apply better with our goals, and we make the gap between the current architecture and the desired architecture measurable. Using these continually impro­ving principles, guidelines, and metrics, software development teams can prepare the system for the future. Not future-proof in the sense of the current system is useful in the future, but stable and future-flexible in the sense that it can be easily adapted. Not concrete, but living tissue.
