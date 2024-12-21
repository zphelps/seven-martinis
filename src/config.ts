
export const config = {
    app: {
        name: "Seven Martinis",
        description: "The Phelps family speakeasy."
    },
    // Just the bare domain name, no protocol or slashes (eg. "nextlaunch.com", NOT "https://nextlaunch.com)
    domain: "sevenmartinis.com",
    auth: {
        loginUrl: "/auth/login",
        defaultAuthenticatedUrl: "/dashboard"
    },
}