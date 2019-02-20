export default function RootQuery() {
  let app = this;
  let postService = app.service('/posts');
  let userService = app.service('/users');
  let alertService = app.service('/alerts');
  let ratingService = app.service('/ratings');
  let followerService = app.service('/followers');

  return {
    userByName(root, { firstName, lastName}, context) {
      return userService.find({
        query: {
          first_name: firstName,
          last_name: lastName
        }
      }).then(users => users[0]);
    },
    userByEmail(root, { email }, context) {
      return userService.find({
        query: { email }
      }).then(users => users[0]);
    },
    userById(root, { id }, context) {
      return userService.get(id);
    },
    userByUsername(root, { username }, context) {
      return userService.find({
        query: { username }
      }).then(users => users[0]);
    },
    users(root, {limit}, context) {
      return userService.find({
        query: {
          $limit: limit || 100
        }
      });
    },
    currentUser(root, args, context) {
      return userService.get(context.user.id);
    },
    posts(root, {limit}, context) {
      return followerService.find({
        query: {
          follower_id: context.user.id
        }
      }).then((followers) => {
        return followers.map(follower => follower.user_id)
      }).then((userIds) => {
        userIds.push(context.user.id);
        return userService.find({
          query: {
            email: 'fooddesignhq@gmail.com'
          }
        }).then(results => results[0]).then((owner) => {
          if(owner){
            userIds.push(owner.id) // add app owner to posts to view
          }
          if (limit) {
            return postService.find({
              query: {
                user_id: {
                  $in: userIds
                },
                $limit: limit,
                $sort: { createdAt: -1 }
              }
            })
          }
          else {
            return postService.find({
              query: {
                user_id: {
                  $in: userIds
                },
                $sort: { createdAt: -1 }
              }
            })
          }
        })

      })
    },
    savedDishes(root, {limit}, context) {
      return ratingService.find({
        query: {
          from_id: context.user.id,
          $sort: { createdAt: -1 },
        }
      }).then((ratings) => {
        return ratings.map(rating => rating.post_id)
      }).then((postIds) => {
        if (limit) {
          return postService.find({
            query: {
              id: {
                $in: postIds
              },
              $limit: limit,
              $sort: { createdAt: -1 }
            }
          })

        }
        else {
          return postService.find({
            query: {
              id: {
                $in: postIds
              },
              $sort: { createdAt: -1 }
            }
          })
        }

      }
        )
    },
    post(root, {id}, context) {
      return postService.get(id);
    },
    alerts(root, {limit}, context) {
      return alertService.find({
        query: {
          user_id: context.user.id,
          $limit: limit || 10,
          $sort: { createdAt: -1 }
        }
      })
    }
  }
}
