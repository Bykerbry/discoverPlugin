$(function(){
    let user;
    let profileUserId;
    const postTag = 'posts'

    authManager.getCurrentUser((err, userInfo) => {
        if (err) {
            console.log('Login Error: ', err)
        } else {
            console.log('User: ', userInfo)
            user = userInfo
        }
    })
    authManager.enforceLogin()
    
    // Need to retrieve ID of selected user (localstorage?)
    buildfire.localStorage.getItem('userId', function(error, result) {
        if (error){
            return console.log('There was an error getting userId: ', error)
        }
        console.log(result)
        profileUserId = result
        buildfire.publicData.search({}, postTag, (err, posts)=>{
            if (err){
                return console.log('There was an error: ', err)
            }
            console.log(posts)
        })
    
        buildfire.localStorage.removeItem('userId')
    })
    // Need to search for only the posts created by the selected user (using user ID)
})