export default function restrictToOthers(hook) {
    let {user_id, from_id} = hook.data;
    if (user_id === from_id){
        hook.result = {
            dataValues: hook.data
        };
    }
    return hook;
}
