

const handleCommentsCount = (count) => {
    if (count < 1000) {
        return `${count} comment${count !== 1 ? "s" : ""}`;
    } else if (count >= 1000 && count < 100000) {
        return `${Math.floor(count / 1000)}k comments`;
    } else if (count >= 100000 && count < 10000000) {
        return `${Math.floor(count / 100000)}lakh comments`;
    } else {
        return `${Math.floor(count / 10000000)}crore comments`;
    }
};

export default handleCommentsCount;
