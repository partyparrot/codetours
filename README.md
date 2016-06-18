# codetours

Introduce developers to your code with an interactive tour

### Problem statement

There are many situations where you need to read someone else's code. Every codebase has a lot of different parts, with some more important than others, and it's very hard to know where to start.

Currently, people often choose to simply sit down with a new developer, and show them around the code, stopping at important functions and explaining what they do and their significance to the overall design. But this is very inefficient and not always possible. Moreover, you can't improve the explanation over time, unless you write up a detailed script to follow.

Specifically, think of the following scenarios:

1. You have hired a new developer to work on a large project, and they need to learn the layout of the codebase
2. You're a maintainer of a large open source project, and you want contributors to be able to get started quickly
3. You're an educator, and you want to make it easy for people to learn about a famous open source project, like React or PostgreSQL
4. You're an educator, and you created an example that demonstrates a particular way of programming, now you need to lead people through the example so that they understand it

All of these can be addressed with a tool that lets you create essentially a slide deck where each slide refers to a snippet of code and comes with an explanation. One could refer to this as a self-guided tour of a codebase - or, as we call it, a **CodeTour**.

### Goals

A code tour is:

1. **Sequential** - it's not a wiki where you read things in whatever order; it takes you through certain parts of the code in a specific order.
2. **Code-focused** - it's not a blog post with some code snippets. The code comes first, and the explanation second.
3. **Up to date** - making a code tour doesn't involve copy-pasting code into an editor. You refer to the actual code in it's natural habitat, for example GitHub. There should be tools to make sure your tour still works in the face of small changes to the code.

There are some additional features that can be enabled by taking advantage of the ecosystem:

1. **Collaborative** - people should be able to submit contributions to a public code tour to help keep it up to date and improve the explanations.
2. **Community-driven** - you should be able to make a tour of any project. For example if someone wants to explain how React works, they shouldn't have to make changes to the React codebase to make a code tour.

### Technology

It makes sense to build this on top of GitHub, which can serve as both:

1. A place where the code is hosted
2. Where code tours are written and collaborated on

So a code tour can be a repository with a configuration file at the root that lists the steps and code snippets, and some markdown files for the content. This has some great benefits:

1. Free hosting for content
2. Collaboration via PRs
3. Discussion via issues

Then we can write an app where you can put in the URL for such a repository, and view the tour in a nice viewer.

If we have time, we can add discovery and community features like a global list of code tours, voting for the best tours, and more.

One question is, should this be a library that you add to your repo and then you view the tour on the GitHub pages site, or is the viewer a standalone app that we host ourselves?