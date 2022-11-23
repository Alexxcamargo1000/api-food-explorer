
export const auth = {
  jwt: {
    secret: process.env.AUTH_SECRET,
    expiresIn: "2d"
  }
}