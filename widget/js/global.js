$(function() {
    authManager.getCurrentUser((err, user) => {
        console.log('user', user)
    })
    authManager.enforceLogin()

    $('.btn-add-post').on('click', (e) => {
        e.preventDefault()
        buildfire.history.push('Create Post')
        location.href = 'CreatePost.html'
    })

    buildfire.history.get({ pluginBreadcrumbsOnly: true }, (err, result) => {
        console.info('Current Plugin Breadcrumbs', result);
    });

    buildfire.appearance.getAppTheme(function(err, appTheme){
        if(err){
            return console.log(err)
        }
        appTheme.appName = 'Discover'
        buildfire.appearance.ready()
        console.log(appTheme)
    })
    buildfire.appearance.titlebar.show()
})

function createCommentID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
}