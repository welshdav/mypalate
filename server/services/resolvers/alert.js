export default function Alert() {
  let app = this;

  let userService = app.service('users');
  let postService = app.service('posts');

  return {
    user(alert, args, context) {
      return userService.get(alert.user_id)
    },
    from(alert, args, context) {
      return userService.get(alert.from_id)
    },
    content(alert, args, context) {
      if (alert.category === "new_follower"){
        return userService.get(alert.from_id)
      } else {
        return postService.get(alert.post_id)
      }
    },
    category(alert, args, context) {
      return alert.category;
    }
  }
}
