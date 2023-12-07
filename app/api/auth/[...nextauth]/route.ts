import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      name: "Pin Kodu",

      credentials: {
        pincode: { label: "Pin kodu", type: "password" },
      },
      async authorize(credentials, req) {
        if (credentials?.pincode === '12345')
        {
          return { id: 'admin', name: 'admin' }
        }

        return null
      }
    })
  ]
})

export { handler as GET, handler as POST }