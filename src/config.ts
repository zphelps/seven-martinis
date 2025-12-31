
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
    features: {
        // Set to true to show tip button in nav bar and tip prompt after ordering
        tipping: false,
        tipUrl: "https://venmo.com/caylan-fields?note=Seven%20Martinis%20(TIP)%20%F0%9F%8D%B8"
    }
}