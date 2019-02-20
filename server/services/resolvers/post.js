export default function Post() {
  let app = this;
  let commentService = app.service('comments');
  let ratingService = app.service('/ratings');
  let imageService = app.service('/images');
  let userService = app.service('/users');

  return {
    comments(post, { limit }, context) {
      if (limit) {
        return commentService.find({
          query: {
            post_id: post.id,
            $limit: limit || 10
          }
        })
      }
      else {
        return commentService.find({
          query: {
            post_id: post.id,
          }
        })
      }
    },
    comment_count(post, { limit }, context) {
      if (limit) {
        return commentService.find({
          query: {
            post_id: post.id,
            $limit: limit
          }
        }).then(comments => comments.length)
      }
      else {
        return commentService.find({
          query: {
            post_id: post.id,
          }
        }).then(comments => comments.length)
      }
    },
    user(post, args, context) {
      return userService.get(post.user_id)
    },
    rating(post, args, context) {
      return ratingService.find({
        query: {
          post_id: post.id
        }
      }).then((ratings) => {
        let numRatings = ratings.length;
        if (numRatings <= 0) return 0;
        else {
          let total = ratings.reduce((prev, curr) => prev + curr.rating, 0);
          return (total / numRatings).toFixed(1);
        }
      })
    },
    user_rating(post, args, context) {
      return ratingService.find({
        query: {
          post_id: post.id,
          from_id: context.user.id
        }
      }).then(ratings => {
        if (ratings && ratings[0]) {
          return ratings[0].rating;
        }
        else {
          return 0;
        }
      })
    },
    ratings_count(post, args, context) {
      return ratingService.find({
        query: {
          post_id: post.id
        }
      }).then(ratings => ratings.length);
    },
    raters(post, args, context) {
      return ratingService.find({
        query: {
          post_id: post.id
        }
      }).then((ratings) => {
        let userIds = ratings.map(rating => rating.from_id);
        return userService.find({
          query: {
            id: {
              $in: userIds
            }
          }
        })
      });
    },
    image_url(post, args, context) {
      return imageService.get(post.image_id).then(image => image.uri);
    }
  }
}
