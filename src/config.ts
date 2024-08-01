
export const config = {
    app: {
        name: "NextLaunch",
        description: "A simple app to track upcoming rocket launches."
    },
    // Just the bare domain name, no protocol or slashes (eg. "nextlaunch.com", NOT "https://nextlaunch.com)
    domain: "nextlaunch.com",
    auth: {
        loginUrl: "/auth/login",
        defaultAuthenticatedUrl: "/dashboard"
    },
}