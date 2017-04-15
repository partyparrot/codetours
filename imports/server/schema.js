const typeDefs = [
  `
  scalar Date
  
  type Query {
    tours(search: String, limit: Float): [Tour]
    tour(tourRepository: String!): Tour
    steps(tourRepository: String!): [Step]
    step(tourRepository: String!, slug: String!): Step
  }
  
  type Mutation {
    importTour(tourRepository: String!): Tour
  }
  
  type Tour {
    _id: String!
    targetRepository: String!
    description: String!
    steps: [Step!]
    repository: String!
    createdAt: Date!
    failed: Boolean
  }
  
  type Step {
    _id: String!
    title: String!
    slug: String!
    codeUrl: String!
    index: Int!
    sections: [Section!]
    user: String!
    tour: Tour!
    fullRepoName: String!
    filePath: String!
    fileUrl: String!
    code: String!
    commit: String
    previous: Step
    next: Step
  }
  
  type Section {
    slug: String
    lineStart: Int
    lineEnd: Int 
    content: String!
  }
`,
];

export default typeDefs;
