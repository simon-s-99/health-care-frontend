import axios from "axios";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
//import { URL } from "url" // url object is disallowed when using next-auth due to problems with edge runtime

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null; // set here so that we explicitly have to set it
        
        const baseUrl: string | undefined = process.env.BACKEND_API_HTTP;

        if (!baseUrl) {
          console.error("Could not retrieve env variable 'BACKEND_API'");
          return;
        }

        const requestUrl: string = (baseUrl as string).concat("/Auth/login");
        console.log(requestUrl);
        try {
          const response = await axios.post(requestUrl.toString(), credentials);

          if (response.status !== 200) {
            throw new Error("Invalid API response " + response.status);
          }

          user = response.data;
        } catch (error) {
          console.error(error + " OR " + "Invalid e-mail or password.");
        }

        if (!user) {
          console.error("no user found"); // No user found
          throw new Error("Invalid credentials.");
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
})

// export const { handlers, signIn, signOut, auth } = NextAuth({
//   session: { strategy: "jwt" },
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       name: "Login",
//       credentials: {
//         username: { label: "Username", type: "username" },
//         password: { label: "Password", type: "password" },
//       },
//       authorize: async (credentials) => {
//         const baseUrl: string | undefined = process.env.BACKEND_API;

//         if (!baseUrl) {
//           console.error("Could not retrieve env variable 'BACKEND_API'");
//           return;
//         }

//         const requestUrl: URL = new URL("/Auth/login", baseUrl);

//         const response = await (async () => {
//           try {
//              const axiosResponse = await axios.post(requestUrl.toString(), credentials)
//             // const resp = await fetch(requestUrl, {
//             //   method: "POST",
//             // })
//             if (!(axiosResponse.status !== 200)) {
//               throw new Error;
//             }
//           } catch {
//             console.error("Invalid e-mail or password.");
//             return;
//           }
//         });

//         const user = {
//           token: response
//         };

//         return user
//       },
//     }),
//   ],
//   pages: {
//     si gnIn: "/Auth/login",
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       return session;
//     }
//   },
// })

