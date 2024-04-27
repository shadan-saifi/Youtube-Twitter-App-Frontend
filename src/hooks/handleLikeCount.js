


const handleLikeCount = (count) => {
    if (count < 1000) {
        return `${count} like${count !== 1 ? "s" : ""}`;
    } else if (count >= 1000 && count < 100000) {
        return `${Math.floor(count / 1000)}k likes`;
    } else if (count >= 100000 && count < 10000000) {
        return `${Math.floor(count / 100000)}lakh likes`;
    } else {
        return `${Math.floor(count / 10000000)}crore likes`;
    }
};

export default handleLikeCount;
