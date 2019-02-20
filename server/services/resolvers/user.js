export default function User() {
  let app = this;
  let userService = app.service('users');
  let followerService = app.service('followers');
  let postService = app.service('posts');
  let avatarService = app.service('avatars');
  return {
    firstName(user, args, context) {
      return user.first_name
    },
    lastName(user) {
      return user.last_name
    },
    posts(user, { limit }, context) {
      if (limit) {
        return postService.find({
          query: {
            user_id: user.id,
            $limit: limit,
            $sort: { createdAt: -1 }
          }
        })
      } else {
        return postService.find({
          query: {
            user_id: user.id,
            $sort: { createdAt: -1 }
          }
        })
      }

    },
    saved_dishes(user, { limit }, context) {
      return postService.find({
        query: {
          user_id: user.id,
          $limit: limit || 10,
          $sort: { createdAt: -1 }
        }
      })
    },
    post_count(user, args, context) {
      return postService.find({
        query: {
          user_id: user.id
        }
      }).then(posts => posts.length)
    },
    followers(user, { limit }, context) {
      return followerService.find({
        query: {
          user_id: user.id,
          $limit: limit || 10
        }
      }).then((followers) => {
        return followers.map(follower => follower.follower_id)
      }
        ).then((followerIds) => {
          return userService.find({
            query: {
              id: {
                $in: followerIds
              }
            }
          })
        })
    },
    follower_count(user, args, context) {
      return followerService.find({
        query: {
          user_id: user.id
        }
      }).then(followers => followers.length);
    },
    following(user, { limit }, context) {
      return followerService.find({
        query: {
          follower_id: user.id,
          $limit: limit || 10
        }
      }).then((followers) => {
        return followers.map(follower => follower.user_id)
      }
        ).then((userIds) => {
          return userService.find({
            query: {
              id: {
                $in: userIds
              }
            }
          })
        })
    },
    following_count(user, args, context) {
      return followerService.find({
        query: {
          follower_id: user.id,
        }
      }).then(following => following.length);
    },
    avatar_url(user, args, context) {
      return avatarService.get(user.avatar_url)
        .then(avatar => avatar.uri)
    },
    rank(user, args, context) {
      return user.rank;
    },
    settings(user, args, context) {
      return {
        commentNotifications: user.comment_notifications,
        ratingNotifications: user.rating_notifications,
        followerNotifications: user.follower_notifications
      }
    }
  }
}
