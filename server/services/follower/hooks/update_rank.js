export default function updateRank(hook) {
    let { user_id } = hook.result.dataValues;
    let userService = hook.app.service('users');
    let followerService = hook.app.service('followers');
    // calculate follower_count by querying the database
    let follower_count;
    let newRank;
    let rankings = {
        commis: {
            low: 0,
            high: 1000
        },
        line_cook: {
            low: 1000,
            high: 10000
        },
        sous_cook: {
            low: 10000,
            high: 50000
        },
        executive_cook: {
            low: 50000,
            high: 250000
        },
        master_cook: {
            low: 250000
        }
    }
    followerService.find({
        query: {
            user_id
        }
    }).then(followers => {
        follower_count = followers.length;
        // update the user's rank based on the follower_count
        if (follower_count < rankings.commis.high) {
            newRank = 'Commis';
        }
        else if (rankings.line_cook.low <= follower_count && follower_count < rankings.line_cook.high) {
            newRank = 'Line Cook'
        }
        else if (rankings.sous_cook.low <= follower_count && follower_count < rankings.sous_cook.high) {
            newRank = 'Sous Cook'
        }
        else if (rankings.executive_cook.low <= follower_count && follower_count < rankings.executive_cook.high) {
            newRank = 'Executive Cook'
        }
        else if (rankings.master_cook.high <= follower_count) {
            newRank = 'Master Cook'
        }
        else {
            newRank = 'Commis'
        }

        userService.patch(user_id, {
            rank: newRank
        })

    })


}
