export class EnvironmentService {
    private static env = {
        localhost: {
            HOST: "http://localhost:3030",
            GRAPHQL_ENDPOINT: "/graphql"
        },
        production: {
            HOST: "http://my-palate.herokuapp.com",
            GRAPHQL_ENDPOINT: "/graphql"
        }
    };
    static getEnv() {
        return this.env.production;
    }

}
