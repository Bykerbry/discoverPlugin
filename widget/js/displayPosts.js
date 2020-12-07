function displayPosts(searchOptions, cb = function(p){console.log(p)}){
    buildfire.publicData.search(searchOptions, 'posts', (error, posts) => {
        if (error) {
           return console.log('Error: ', error)
        } 
        if (posts.length > 0) {
            posts.forEach((post, i) => {
                console.log(post)
                const img = $('<img>')
                img.attr('src', post.data.post.src)
                img.data('postId', post.id)
                $(img).load(function(){
                    const column = determineColumn()
                    $(this).appendTo(`#col-${column}`)
                })
            })
        } else {
            $('.no-posts').removeClass('d-none')
        }
        cb(posts)
    })
}

function determineColumn() {
    const leftHeight = parseInt($('#col-left').innerHeight())
    const rightHeight = parseInt($('#col-right').innerHeight())
    console.log('Left: ' + leftHeight, 'Right: ' + rightHeight)
    return rightHeight < leftHeight ? 'right' : 'left'
}