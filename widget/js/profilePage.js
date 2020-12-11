let activeUser;

$(function(){
    const postTag = 'posts'

    authManager.getCurrentUser((err, userInfo) => {
        if (err) {
            console.log('Login Error: ', err)
        } else {
            console.log('User: ', userInfo)
            activeUser = userInfo
        }
    })
    authManager.enforceLogin()

    buildfire.navigation.onBackButtonClick = function(){
        buildfire.history.pop()
        location.href = 'index.html'
    }
    
    buildfire.localStorage.getItem('selectedUser', function(error, profileOwner) {
        if (error){
            return console.log('There was an error getting userId: ', error)
        }
        profileOwner = JSON.parse(profileOwner)
        $('#username').text(profileOwner.name)
        $('.username').text(profileOwner.name)


        // Get profile picture & once loaded, remove default & show img
        const pic = buildfire.auth.getUserPictureUrl({userId: profileOwner.id})
        $('.profile-picture img').load(pic, function(response, status, xhr){
            if (status === 'error') {
                console.log($(this)[0])
                return console.log('There was an error: ', response)
            }
            // $('.profile-picture img').attr('src', response)
            $('.glyphicon-user').addClass('d-none')
            $(this).removeClass('d-none')
        })

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

    $('#main-feed-container').on('click', 'img', function() {
        const postId = $(this).data('postId')
        const $modal = $('#view-post-modal')
        const $modalBody = $('#view-post-modal .modal-body')
        $modal.modal('show')
        buildfire.publicData.getById(postId, postTag, (error, postInfo) => {
            if (error) {
                return console.log('Error: ' , error)
            }
            const { post, user } = postInfo.data
            //set ID of the post's creator into the <a> tag to retrieve on click
            $modal.find('.username').text(user.name).data('userId', user.id)
            $modal.find('.post-creation-time').text(formatTime(post.createdOn))
            $modalBody.html(`
                <img src="${post.src}">
                <p class="mt-3">${post.caption}</p>
                <div class="d-flex interaction-container">
                    <div>
                        <button class="btn btn-white pl-0 pr-2 btn-like"><i class="glyphicon glyphicon-heart text-danger"></i></button>
                        <span class="num-likes">${post.likes.length}</span>
                    </div>
                    <div class="ml-3">
                        <button class="btn btn-white pr-2 btn-comment"><i class="glyphicon glyphicon-comment text-primary"></i></button>
                        <span class="num-comments">${post.comments.length}</span>
                    </div>
                </div>
                <div class="d-none add-comment-container">
                    <textarea class='autoExpand border-top-none border-right-none border-left-none border-bottom-grey w-100 pt-3 pb-1 comment' rows='1' placeholder='Write a comment...'></textarea>
                    <button class="btn btn-primary btn-add-co btn-post-comment">Post Comment</button>
                </div>
                <div class="comments-container"></div>
            `)

            $modalBody.find('.interaction-container').data('postId', postId)
            post.comments.forEach(comment => displayComment(comment))
            
        })
    })

})

