export default function Comment() {
  let app = this;
  let postService = app.service('posts');
  let userService = app.service('users');

  return {
    from(comment, args, context) {
      return userService.get(comment.from_id)
    },
    post(comment, args, context) {
      return postService.get(comment.post_id)
    }
  }
}
