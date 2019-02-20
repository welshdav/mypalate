export default function RootMutation() {
  let app = this;
  let postService = app.service('/posts');
  let userService = app.service('/users');
  let commentService = app.service('/comments');
  let alertService = app.service('/alerts');
  let ratingService = app.service('/ratings');
  let imageService = app.service('/images');
  let avatarService = app.service('/avatars');
  let followerService = app.service('/followers');
  let reportService = app.service('/reports');

  return {
    createPost(root, {title, description, recipe, image}, context) {
      return imageService.create({
        uri: image
      }).then((imageResult) => {
        return postService.create({
          title,
          description,
          recipe,
          image_id: imageResult.id,
          user_id: context.user.id
        })
      })

    },
    deletePost(root, {postId}, context) {
      return postService.remove(postId);
    },
    createComment(root, {postId, content}, context) {
      return commentService.create({
        content,
        post_id: postId,
        from_id: context.user.id
      }).then((comment) => {
        postService.get(postId).then(({user_id}) => {
          alertService.create({
            category: "comment",
            user_id,
            from_id: context.user.id,
            post_id: postId
          })
        })
        return comment;
      })
    },
    deleteComment(root, {commentId}, context) {
      return commentService.remove(commentId);
    },
    ratePost(root, {postId, rating}, context) {
      let isNewRating = false;
      return ratingService.find({
        query: {
          from_id: context.user.id,
          post_id: postId
        }
      }).then(ratings => {
        isNewRating = !(ratings && ratings[0]);
        if (!isNewRating) {
          return ratingService.patch(ratings[0].id, {
            rating,
            post_id: postId,
            from_id: context.user.id
          })
        }
        else {
          return ratingService.create({
            rating,
            post_id: postId,
            from_id: context.user.id
          })
        }
      }).then(() => {
        return postService.get(postId);
      }).then((post) => {
        if (isNewRating) {
          return alertService.create({
            user_id: post.user_id,
            from_id: context.user.id,
            category: "rate",
            post_id: post.id
          }).then(() => { return post });
        }
        else {
          return post;
        }
      });
    },
    followUser(root, { userId }, context) {
      return followerService.create({
        user_id: userId,
        follower_id: context.user.id,
      }).then(() => {
        return alertService.create({
          user_id: userId,
          from_id: context.user.id,
          category: "new_follower"
        })
      })
    },
    unFollowUser(root, { userId }, context) {
      return followerService.find({
        query: {
          user_id: userId,
          follower_id: context.user.id
        }
      }).then((followers) => {
        followers.forEach(follower => {
          followerService.remove(follower.id)
        });
        return followers;
      }).then(() => {
        return userService.get(userId);
      })
    },
    updateProfilePic(root, { image }, context) {
      return avatarService.create({
        uri: image
      }).then((imageResult) => {
        return userService.patch(context.user.id, {
          avatar_url: imageResult.id
        })
      })
    },
    updateSettings(root, {ratingNotifications, commentNotifications, followerNotifications}, context) {
      return userService.patch(context.user.id, {
        rating_notifications: ratingNotifications,
        comment_notifications: commentNotifications,
        follower_notifications: followerNotifications
      })
    },
    reportAbuse(root, args, context) {
      return reportService.create(args);
    },
    changePassword(root, {newPassword}, context) {
      return userService.patch(context.user.id, {
        password: newPassword
      })
    },
    changeUsername(root, {newUsername}, context) {
      return userService.patch(context.user.id, {
        username: newUsername
      })
    }
  }
}
