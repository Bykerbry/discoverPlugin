$(function() {
    let user;
    const postTag = 'posts'

    authManager.getCurrentUser((err, userInfo) => {
        if (err) {
            console.log(err)
        } else {
            console.log('user', userInfo)
            user = userInfo
            $(".username").text(user.displayName) 
        }
    })
    authManager.enforceLogin()

    buildfire.history.get({ pluginBreadcrumbsOnly: true }, function(err, result){
        console.info('Current Plugin Breadcrumbs', result);
    });

    buildfire.navigation.onBackButtonClick = function(){
        buildfire.history.pop()
        location.href = 'index.html'
    }

    // // For Testing
    // $('.btn-delete').on('click',() => {
    //     buildfire.publicData.search({}, postTag, function(err,records){
    //         if(err)
    //             alert('there was a problem retrieving your data');
    //         else if ( records.length == 0)
    //             alert('no records found');
    //         else{
    //             console.log(records)
    //             records.forEach(record => {
    //                 buildfire.publicData.delete(record.id, postTag, function(err, status){
    //                     if(err)
    //                         console.log('there was a problem deleteing your data');
    //                     else
    //                         console.log('Record Deleted');
    //                 })    
    //             })
    //         }
    //     });
    // })

    // //For testing
    // $('.btn-search').on('click',() => {
    //     buildfire.publicData.search({}, postTag, (err, data) => {
    //         if (err) {
    //             console.log('error: ', err)
    //         } else {
    //             console.log(data)
    //         }
    //     })
    // })

    $('.photo-import').on('change', (e) => {
        console.log(e.target.files[0])
        $('.logo-preview').html('')
		const reader = new FileReader()

		reader.onloadend = function() {
            imgSrc = reader.result
            $('.uploaded-img').attr('src', reader.result)
            $('.upload-container').addClass('d-none')
            $('.upload-preview-container').removeClass('d-none')
            console.log($('.uploaded-img').attr('src').substring(0,50))
            // console.log("2", reader.result)
        }
        reader.readAsDataURL(e.target.files[0])
    })

    $('.uploaded-img').on('click', () => {
        $('.photo-import').trigger('click')
    })

    $('.autoExpand').on("input", function () {
        $(this).css("height", ""); //reset the height
        $(this).css("height", $(this).prop('scrollHeight') + "px");
    });

    $('.btn-confirm-post').on('click', () => {
        const post = {
            user: {
                id: user._id,
                name: user.displayName,
            },
            post: {
                src: $('.uploaded-img').attr('src'),
                caption: $('.caption').val(),
                createdOn: Date.now(),
                likes: [],
                comments: []
            }
        }

        $('.btn-confirm-post').text('Posting...').prop('disabled', true)
        $('.post-error-msg').addClass('d-none')

        buildfire.publicData.insert(post, postTag, (err, data) => {
            if (err) {
                console.log('error: ', err)
                $('.btn-confirm-post').text('Post').prop('disabled', false)
                $('.post-error-msg').text('There was an error posting your photo').removeClass('d-none')
            } else {
                $('.btn-confirm-post').text('Post').prop('disabled', false).addClass('d-none')
                buildfire.history.pop()
                location.href = 'index.html'
            }
        })
    })
})