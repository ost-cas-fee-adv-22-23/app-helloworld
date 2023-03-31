import axios from 'axios';

export const likePost = async (params?: { postId: string; likedByUser: boolean; accessToken?: string }) => {
    const { postId, likedByUser, accessToken } = params || {};

    if (!accessToken) {
        throw new Error('No access token');
    }

    const url = `${process.env.NEXT_PUBLIC_QWACKER_API_URL}posts/${postId}/likes`;

    if (likedByUser) {
        return await axios
            .delete(url, { headers: { 'content-type': 'application/json', Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                console.log(response.data);
            });
    } else {
        return await axios
            .put(url, undefined, { headers: { 'content-type': 'application/json', Authorization: `Bearer ${accessToken}` } })
            .then((response) => {
                console.log(response.data);
            });
    }
};
