export default {
    __resolveType(data, context, info){
      if(data.email){
        return info.schema.getType('User');
      }
      if(data.image_id){
        return info.schema.getType('Post');
      }
      return null;
    },
  }
