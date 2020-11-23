const authManager = {
    getCurrentUser(callback) {
        return buildfire.auth.getCurrentUser((error, user) => {
            if (!user) {
                buildfire.auth.login({ allowCancel: false }, callback)
            } else {
                callback(null, user)
            }
        }) 
    },
    enforceLogin() {
        buildfire.auth.onLogout(() => {
            authManager.getCurrentUser()
        })
    }
}