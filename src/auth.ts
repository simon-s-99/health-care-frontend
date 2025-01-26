import axios from "axios";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
//import { URL } from "url" // url object is disallowed when using next-auth due to problems with edge runtime

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: process.env.NODE_ENV !== "production", // allow debug messages in console in dev mode
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        Username: {},
        Password: {},
      },
      authorize: async (credentials) => {
        let user = null; // set to null here so that we explicitly have to set it
        
        // TODO - change this before production so env variable points to correct secret
        const baseUrl: string | undefined = process.env.BACKEND_API_HTTP;

        if (!baseUrl) { // this should realistically never happen
          throw new Error("Could not retrieve env variable 'BACKEND_API'");
        }

        const requestUrl: string = (baseUrl as string).concat("/Auth/login");

        try {
          const response = await axios.post(requestUrl.toString(), credentials);

          if (response.status !== 200) {
            throw new Error("Invalid API response " + response.status);
          }

          user = response.data;

        } catch (error) {
          throw new Error(error + "");
        }

        if (!user) { // No user found
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        // (this object might need to be extended to accomodate our use-case)
        return user;
      },
    }),
  ],
})
