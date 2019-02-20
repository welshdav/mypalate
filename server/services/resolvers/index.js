import Alert from './alert';
import AlertContent from './alert-content';
import Comment from './comment';
import Post from './post';
import User from './user';
import RootQuery from './root-query';
import RootMutation from './root-mutation';

export default function Resolvers() {
    let app = this;
    return {
        User: User.call(app),
        Post: Post.call(app),
        Comment: Comment.call(app),
        AlertContent: AlertContent,
        Alert: Alert.call(app),
        RootQuery: RootQuery.call(app),
        RootMutation: RootMutation.call(app)
    }
}
