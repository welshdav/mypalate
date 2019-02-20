import { MockList } from 'graphql-tools';
import faker from 'faker';

const mocks = {
  Int: () => faker.random.number(),

  User: () => ({
    firstName: () => faker.name.firstName(),
    lastName: () => faker.name.lastName(),
    username: () => faker.internet.userName(),
    email: () => faker.internet.email(),
    description: () => faker.lorem.words(),
    posts: (root,{limit}) => new MockList([1,limit || 10]),
    followers: () => new MockList([1,10]),
    following: () => new MockList([1,10]),
    saved_dishes: () => new MockList([1,10]),
    avatar_url: () => faker.image.avatar(),
    rank: () => ['commis','line_cook','sous_cook','executive_chef','master_chef'][Math.floor(Math.random()*5)]
  }),

  Post: () => ({
    title: () => faker.lorem.words(),
    description: () => faker.lorem.sentences(),
    recipe: () => faker.lorem.lines(),
    createdAt: () => faker.date.past(),
    comments: (root,{limit}) => new MockList([1,limit || 10]),
    comment_count: () => Math.floor(Math.random() * 100),
    rating: () => (Math.random() * (5-1) + 1).toFixed(1),
    raters: () => new MockList([1,10]),
    likers: () => new MockList([1,10]),
    image_url: () => faker.image.food()
  }),

  Comment: () => ({
    content: () => faker.lorem.sentences(),
    createdAt: () => faker.date.past()
  }),

  Alert: () => ({
    category: () => ["comment","rate","follow_request","new_follower"][Math.floor(Math.random()*4)]
  }),

  RootQuery: () => ({
    userByName: (root, {firstName, lastName}) => ({firstName, lastName}),
    userByEmail: (root, {email}) => ({email}),
    userById: (root, {id}) => ({id}),
    userByUsername: (root, {username}) => ({username}),
    users: (root,{limit}) => new MockList([limit || 100,limit || 100]),
    currentUser: () => ({id: 4}),
    posts: (root,{limit}) => new MockList([1,limit || 10]),
    post: (root,{id}) => ({id}),
    alerts: () => new MockList([1,10])
  }),

  RootMutation: () => ({
      createPost: (root,{title,description,recipe,image}) => ({title,description,recipe, image_url: image}),
      createComment: (root,{postId, content}) => ({content}),
      ratePost: (root,{ rating}) => ({rating})
  })
}

export default mocks;
