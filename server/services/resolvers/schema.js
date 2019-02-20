const typeDefinitions = `

enum AlertCategory {
  comment
  rate
  new_follower
}

enum Rank {
  commis
  line_cook
  sous_cook
  executive_chef
  master_chef
}

type Settings {
  commentNotifications: Boolean
  ratingNotifications: Boolean
  followerNotifications: Boolean
}

type User {
  id: Int! # the ! means that every user object _must_ have an id
  firstName: String
  lastName: String
  username: String
  email: String
  description: String
  posts(limit: Int): [Post] # the list of Posts by this user
  post_count: Int
  saved_dishes(limit: Int): [Post]
  followers(limit: Int): [User]
  follower_count: Int
  following(limit: Int): [User]
  following_count: Int
  avatar_url: String
  rank: Rank
  settings: Settings
}

type Post {
  id: Int!
  title: String
  description: String
  recipe: String
  createdAt: String
  comments(limit: Int) : [Comment]
  comment_count: Int,
  rating: Float
  user_rating: Int
  ratings_count: Int
  raters(limit: Int):[User]
  user: User
  image_url: String
}

type Comment {
  id: Int!
  post: Post
  content: String!
  from: User
  createdAt: String
}

union AlertContent = Post | User

type Alert {
  id: Int!
  category: AlertCategory
  user: User
  from: User
  content: AlertContent
}

type Report {
  id: Int!
  contentType: String!
  contentId: Int!
  reason: String!
  description: String
}

# the schema allows the following two queries:
type RootQuery {
  userByName(firstName: String, lastName: String): User
  userByEmail(email: String!): User
  userById(id: Int!): User
  userByUsername(username: String!): User
  users(limit: Int): [User]
  currentUser: User
  posts(limit: Int): [Post]
  savedDishes(limit: Int): [Post]
  post(id: Int!): Post
  alerts(limit: Int): [Alert]
}

# this schema allows the following two mutations:
type RootMutation {

  createPost(
    title: String
    description: String!
    recipe: String
    image: String
  ): Post

  deletePost(
    postId: Int!
  ): Post

  createComment(
    postId: Int!
    content: String!
  ): Comment

  deleteComment(
    commentId: Int!
  ): Comment

  ratePost(
    postId: Int!
    rating: Int!
  ): Post

  followUser(
    userId: Int!
  ): Alert

  unFollowUser(
    userId: Int!
  ): User

  updateProfilePic(
    image: String!
  ): User

  updateSettings(
    ratingNotifications: Boolean,
    commentNotifications: Boolean,
    followerNotifications: Boolean
  ): User

  reportAbuse(
    contentType: String!
    contentId: Int!
    reason: String!
    description: String
  ): Report

  changePassword(
    newPassword: String!
  ): User

  changeUsername(
    newUsername: String!
  ): User
}

# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
  query: RootQuery
  mutation: RootMutation
}
`;



export default [typeDefinitions]
