// Posts endpoints

// Posts URL params
export const posts = (limit, skip) => `/posts?limit=${limit}&skip=${skip}`

// posts of specific user
export const userPosts = (userId, limit, skip) => `/posts/user/${userId}?limit=${limit}&skip=${skip}`

// Posts URL params
export const postComments = (postId, limit, skip) => `/comments/post/${postId}?limit=${limit}&skip=${skip}`