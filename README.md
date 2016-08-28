# CodeTours

## TL;DR: 

### What's a CodeTour?
A CodeTour is a way for you to introduce new developers to a codebase by giving them a self-guided tour. All CodeTours are vieweable and searchable at https://www.codetours.xyz/. 

### Why make a CodeTour?
You are hiring like crazy, and you don't want to spend hours sitting down with each new hire and walking through your codebase.

You are the maintainer of a large open source project, and you want to make it super easy for people to understand how it works and contribute.

You are building out a GitHub portfolio, and want to be able to highlight important parts of your projects.

You are a good person and want to share and grow the world's knowledge by teaching other people how your favorite libraries and frameworks work.

### How do I make a CodeTour?
If this is your first time making a tour, take a few minutes to check out our CodeTour for CodeTour (it's meta, we know). We promise everything will make a lot more sense after taking this tour.
If you've done it before, here's the TL;DR in case you need a reminder:

Fork the starter kit, or another existing tour
Edit the config file, content, and code links
Import your code tour here:

https://www.codetours.xyz/

## Full Design Doc: 


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

### Hosted by us, or by GitHub pages?

One question is, should this be a library that you add to your repo and then you view the tour on the GitHub pages site, or is the viewer a standalone app that we host ourselves?

Tradeoffs:

- Each code tour author hosts their own on GitHub pages
    - Free
    - Keeps working if our service shuts down
    - Author can hack their own viewer if they want a different UX for their own tour
- We host a central service that displays the code tours
    - Needs to be manually updated - we can't just ship a new UX whenever
    - We can't easily index all existing code tours
    - Harder to get started, since you need to set up github pages, download the library, etc

Current decision: host it ourselves, but make it open source and modular so that people can host it themselves if they really want to.

It seems advantageous to copy all of the GitHub data into our DB, to avoid dealing with GitHub API all the time. The content is completely read-only.

We should start with public repos only, and expand to private repos if it catches on.

## Design

### Tour

Has a name, summary, and a series of steps. Those come from a GitHub repository. The code and tour metadata can be in the same repository if both are owned by the same person.

Has a viewable table of contents that shows the names of the steps.

### Step

Has a name, one or more code snippets, and markdown content. Has next and previous steps. Can link to arbitrary steps?

- Question: Should we support more than one snippet? Benefit is that sometimes you want to show a couple things together.
- Question: How exactly does one specify the code snippet?

Markdown content should be able to have video/image embeds (how does GitHub handle this? do we need a custom video embed thingy)

#### Specifying snippet

1. Commit hash and line numbers - easiest to implement, most brittle, relies on PRs to update
2. Commit hash and search terms for start/end - need to update commit manually, and you can check if it is still relevant
3. Search terms and branch name - updates automatically, might break if search terms are not found
4. Search terms and branch name - we follow every commit and notify when relevant lines are modified

### Tour UX

Need to display:

1. Name of tour
1. ToC of tour
2. File structure of repo, and currently viewed file
3. Links to file issues/PRs on GitHub to tour content
3. Links to navigate to GitHub code
4. Markdown content
5. Links to navigate between steps
    - Bonus: animate between steps to orient people

### Definition format

JSON version, simplest:

```
{
  "name": "GitHunt example app",
  "summary": "Some stuff here",
  "repository": "apollostack/GitHunt",
  "commit": "21afda8df78daf8",
  "steps": [
    {
      "name": "Server index",
      "snippet": {
        "filename": "server/index.js",
        "lines": [55, 67],
      },
      "content": "tour/server-index.md"
    }
  ]
} 
```

Alternative: just specify content, and rest is in YAML front matter - then markdown would be more portable, and it would be easier to copy steps since they are just self-contained files.
