---
title: GraphQL Schema
code: https://github.com/apollostack/GitHunt-API/blob/8549f50246b29e7f999a96ec15406c0a82713321/api/schema.js#L5-L46
---

The core of a GraphQL server is its schema - this is a representation of the data available. The default API for graphql-js uses constructors to create object types, but using a package called graphql-tools, you can instead write the schema using the GraphQL type language.

<a href="https://github.com/apollostack/GitHunt-API/blob/8549f50246b29e7f999a96ec15406c0a82713321/api/schema.js#L13" id="query-type"><h3>Query type</h3></a>

Every GraphQL schema needs a Query type - that defines the entry point to the whole API. Here you can see that when we query the server, we can initially ask for the feed, a specific entry, or the currentUser.

<a href="https://github.com/apollostack/GitHunt-API/blob/8549f50246b29e7f999a96ec15406c0a82713321/api/schema.js#L31" id="mutation-type"><h3>Mutation type</h3></a>

Query type is for reading data - when we want to write data, we need a Mutation type. Here you can see that the possible data writes in this app are submitRepository, vote, and submitComment.

<a href="https://github.com/apollostack/GitHunt-API/blob/8549f50246b29e7f999a96ec15406c0a82713321/api/schema.js#L119-L121" id="importing-schema"><h3>Importing schema parts</h3></a>

Obviously, we can't put the whole schema of the API in just one file, so this one represents the core root fields. We import the rest from another file and merge them together, as seen here.

Let's move on and look at one of the more specific schema files.
