const { DateTime : dt } = luxon

function formatTime(createdOn){
    const today = dt.local()
    const postDate = dt.fromMillis(createdOn)
    const daysSince = postDate.diffNow('days').days

    //if postDate today (Today 2:35 PM)
    if (postDate.startOf('day').day == today.day) {
        return postDate.toFormat("'Today' t")
    //if postDate yesterday (Yesterday 2:35PM)
    } else if(postDate.startOf('day').day == today.day-1){
        return postDate.toFormat("'Yesterday' t")
    //if postDate within 6 days of today (Wednesday 2:35 PM)
    } else if(daysSince >= -6) {
        return postDate.toFormat("EEEE t")
    //if postDate over a year old (12/11/2018)
    } else if (daysSince <= -365) {
        return postDate.toFormat("D")
    //else (Wed, Dec 11, 2:35 PM)
    } else {
        return postDate.toFormat("EEE',' MMM d',' t")
    }
}