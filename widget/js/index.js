let activeUser;

$(function() {
    authManager.getCurrentUser((err, userInfo) => {
        if (err) {
            console.log('Login Error: ', err)
        } else {
            console.log('User: ', userInfo)
            activeUser = userInfo
        }
    })
    authManager.enforceLogin()

    // Display posts on page load
    displayPosts({})

    // Link to profile page of post owner
    $('#view-post-modal').on('click', '.username', function(){
        const selectedUser = JSON.stringify({
            name: $(this).text(),
            id: $(this).data('userId')
        })
        buildfire.localStorage.setItem('selectedUser', selectedUser, function(error, result){
            if (error){
                return console.log('There was an error setting to localStorage: ', error)
            }
            buildfire.history.push('Profile Page')
        })
    })
})


