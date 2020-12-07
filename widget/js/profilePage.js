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
    
    buildfire.localStorage.getItem('selectedUser', function(error, profileOwner) {
        if (error){
            return console.log('There was an error getting userId: ', error)
        }
        profileOwner = JSON.parse(profileOwner)
        $('#username').text(profileOwner.name)
        
        const searchOptions = {
            filter: {
                "$json.user.id": profileOwner.id
            }, 
            page: 0, 
            pageSize: 3
        }

        displayPosts(searchOptions, function(posts){
            const totalPosts = posts.length
            let likes = 0

            posts.forEach(post => {
                likes += post.data.post.likes.length
            });

            $('#post-count').text(totalPosts)
            $('#like-count').text(likes)
        })
    
        buildfire.localStorage.removeItem('selectedUser')
    })
    // Need to search for only the posts created by the selected user (using user ID)
})