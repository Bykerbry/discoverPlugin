const postTag = 'posts'
$(function() {
    //View Post Modal
    $('#main-feed-container').on('click', 'img', function() {
        const postId = $(this).data('postId')
        const $modal = $('#view-post-modal')
        const $modalBody = $('#view-post-modal .modal-body')
        $('.btn-delete-post').addClass('d-none')
        $modal.modal('show')
        buildfire.publicData.getById(postId, postTag, (error, postInfo) => {
            if (error) {
                return console.log('Error: ' , error)
            }
            const { post, user } = postInfo.data
            //set ID of the post's creator into the <a> tag to retrieve on click
            if (user.id == activeUser._id) {
                $('.btn-delete-post').removeClass('d-none')
            } 
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
    
    // Like post
    $('#view-post-modal').on('click', '.btn-like', function(){
        const postId = $(this).closest('.interaction-container').data('postId')
        buildfire.publicData.getById(postId, postTag, (error, post) => {
            const { likes } = post.data.post
            if (error) {
                return console.log('Error: ' , error)
            }
            const action = {};
            likes.map((userId, index) => {
                if (userId === activeUser._id) {
                    action.hasPreviouslyLiked = true;
                    action.index = index
                    return false;
                }
            })
            action.hasPreviouslyLiked ? likes.splice(action.index, 1) : likes.push(activeUser._id)
            buildfire.publicData.update(postId, post.data, postTag, function(error, status){
                if (error) {
                    return console.log('Error updating: ', error)
                }
                $('.num-likes').text(status.data.post.likes.length)
            })
        })
    })
    
    
    // Comment on post
    $('#view-post-modal').on('click', '.btn-post-comment', function(){
        const postId = $('.interaction-container').data('postId')
        buildfire.publicData.getById(postId, postTag, (error, post) => {
            const { comments } = post.data.post
            if (error) {
                return console.log('Error: ' , error)
            }
            const commentInfo = {
                user: {
                    name: activeUser.displayName,
                    id: activeUser._id
                },
                comment: {
                    comment: $('.comment').val(),
                    createdOn: Date.now(),
                    likes: []
                }
            };
            comments.push(commentInfo)
            buildfire.publicData.update(postId, post.data, postTag, function(error, status){
                if (error) {
                    return console.log('Error updating: ', error)
                }
                $('.num-comments').text(status.data.post.comments.length)
                $('.comment').val('')
                displayComment(commentInfo)
            })
        })
    })
    
    
    // Like a comment
    $('#view-post-modal').on('click', '.btn-comment-like', function(){
        const postId = $('.interaction-container').data('postId')
        const $commentContainer = $(this).closest('.comment-container')
        const commentCreatedOn = $commentContainer.data('commentCreatedOn')

        buildfire.publicData.getById(postId, postTag, (error, post) => {
            if (error) {
                return console.log('Error: ' , error)
            }
            const { comments } = post.data.post
            const selectedCommentIndex = comments.findIndex(comment => comment.comment.createdOn == commentCreatedOn)
            const selectedComment = comments.find(comment => comment.comment.createdOn == commentCreatedOn)
            const { likes } = selectedComment.comment
            const action = {}
            likes.map((userId, index) => {
                if (userId === activeUser._id) {
                    action.hasPreviouslyLiked = true;
                    action.index = index
                }
            })
            action.hasPreviouslyLiked ? likes.splice(action.index, 1) : likes.push(activeUser._id)
            buildfire.publicData.update(postId, post.data, postTag, function(error, status){
                if (error) {
                    return console.log('Error: ' , error)
                }
                $commentContainer.find('.num-comment-likes').text(status.data.post.comments[selectedCommentIndex].comment.likes.length)
            })
        })
    })

    //Delete Post
    $('.btn-delete-post').on('click', function(){
        const $modal = $('#view-post-modal')
        const postOwnerId = $modal.find('.username').data('userId')
        const postId = $modal.find('.interaction-container').data('postId')
        if (activeUser._id === postOwnerId) {
            buildfire.publicData.delete(postId, postTag, function(err, status){
                if (err){
                    console.log('Error deleting: ', err)
                }
                const pagePosts = $('#main-feed-container').find('img')
                pagePosts.each((i,post) =>{
                    if ($(post).data('postId') === postId){
                        return $(post).remove()
                    }
                })
                $modal.modal('hide')
            })
        }
    })

    //Delete Comment
    $('#view-post-modal').on('click', '.btn-delete-comment', function(){
        const $modal = $('#view-post-modal')
        const postId = $modal.find('.interaction-container').data('postId')
        const $commentContainer = $(this).parents('.comment-container')
        const commentCreatedOn = $commentContainer.data('commentCreatedOn')

        buildfire.publicData.getById(postId, postTag, function(err, post){
            if (err){
                return console.log('There was an error retrieving the post: ', err)
            }
            const { comments } = post.data.post
            const updatedComments = comments.filter(comment => comment.comment.createdOn != commentCreatedOn)
            post.data.post.comments = updatedComments
            
            buildfire.publicData.update(postId, post.data, postTag, function(err, status){
                if (err){
                    console.log('There was an error updating the post: ', err)
                }
                $commentContainer.remove()
            })
        })
    })
    
    // Auto Expand Text Input
    $('#view-post-modal').on("input", '.autoExpand', function () {
        $(this).css("height", ""); //reset the height
        $(this).css("height", $(this).prop('scrollHeight') + "px");
    });
    
    // Toggle comment input
    $('#view-post-modal').on('click', '.btn-comment', function(){
        $('.add-comment-container').toggleClass('d-none')
    })
    
})

const displayComment = (commentInfo) => {
    const { comment } = commentInfo
    $('#view-post-modal .modal-body').find('.comments-container').prepend(`
    <div class='comment-container mt-3'>
        <div class='default-background border-radius-six border-radius-bottom-none p-2 d-flex justify-between'>
            <span>${commentInfo.user.name}</span> <small class='text-muted text-small'>${formatTime(comment.createdOn)}</small>
        </div>
        <div class='border-default border-radius-six border-radius-top-none'>
            <div class="p-2">
                ${comment.comment}
                <div class="pt-2 d-flex justify-between">
                    <div>
                        <button class="btn btn-white pt-0 pl-0 pb-0 pr-2 btn-comment-like"><i class="glyphicon glyphicon-heart text-danger"></i></button>
                        <span class="num-comment-likes">${comment.likes.length}</span>
                    </div>
                    ${
                        commentInfo.user.id === activeUser._id 
                        ? '<button class="btn btn-white pt-0 pl-0 pb-0 pr-2 btn-delete-comment"><i class="glyphicon glyphicon-trash text-danger"></i></button>'
                        : ''
                    }
                </div>
            </div>
        </div>
    </div>
    `)
    $('.comments-container .comment-container').first().data('commentCreatedOn', comment.createdOn)
}
