$(function(){
    const postTag = 'posts'
    buildfire.publicData.search({}, postTag, function(err, posts){
        if (err) {
            return console.log('There was an error getting the posts: ', err)
        }
        console.log(posts)
        $('.loading-msg').addClass('d-none')
        if (posts.length > 0) {
            displayPosts(posts)
        } else {
            $('.no-posts').removeClass('d-none')
        }
    })

    $('.posts-container').on('click', '.btn-ban-user', function(){
        const userId = $(this).parents('.post-container').data('userId')
        console.log('userId: ', userId)
    })
})

function displayPosts(posts) {
    const $postsContainer = $('.posts-container')
    console.log(posts)
    posts.forEach((postInfo, i) => {
        const { post, user } = postInfo.data
        $postsContainer.prepend(`
            <div class="post-container border-default border-radius-six mb-3">
                <div class="post-header d-flex align-center p-3 default-background border-radius-six border-radius-bottom-none justify-between">
                    <div class="post-header-left d-flex align-center">
                        <span>${user.name}</span>
                    </div>
                    <div class="post-header-right">
                        ${formatTime(post.createdOn)}
                    </div>
                </div>
                <div class="post-body p-3">
                    <p>${post.caption}</p>
                    <div class="d-flex justify-center">
                        <img class="" src="${post.src}" alt="Profile Picture">
                    </div>
                </div>
                <div class="post-footer d-flex justify-between p-3">
                    <div class="interactions-container d-flex justify-between">
                        <div>
                            <button class="btn btn-white pl-0 pr-2 btn-like"><i class="glyphicon glyphicon-heart text-danger"></i></button>
                            <span class="num-likes">${post.likes.length}</span>
                        </div>
                        <div class="ml-3">
                            <button class="btn btn-white pr-2 btn-comment"><i class="glyphicon glyphicon-comment text-primary"></i></button>
                            <span class="num-comments">${post.comments.length}</span>
                        </div>
                    </div>
                    <div class="auth-actions-container">
                        <button class="btn btn-danger btn-ban-user">Ban User</button>
                        <button class="btn btn-danger btn-delete-post">Delete Post</button>
                    </div>
                </div>
            </div>
        `)
        $('.posts-container .post-container').first().data('userId', user.id)
    });
}