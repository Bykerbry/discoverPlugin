$(function() {
    $('.btn-add-post').on('click', (e) => {
        e.preventDefault()
        buildfire.history.push('Create Post')
        location.href = 'CreatePost.html'
    })

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