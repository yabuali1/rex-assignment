export const IMAGE_SIZES = {
    THUMBNAIL: '90x90',
    SMALL: '240x150',
    MEDIUM: '312x231',
    LARGE: '480x360',
    XL: '556x370',
    FULL: '636x393',
}

export function getImageUrl(imageUrl, size = IMAGE_SIZES.MEDIUM) {
    if (!imageUrl) return null

    // Match pattern like "312x231" in the URL
    const sizePattern = /\d+x\d+/

    if (sizePattern.test(imageUrl)) {
        return imageUrl.replace(sizePattern, size)
    }

    // If no size pattern found, return original
    return imageUrl
}

export function getImageSrcSet(imageUrl) {
    if (!imageUrl) return ''

    return `
    ${getImageUrl(imageUrl, IMAGE_SIZES.MEDIUM)} 312w,
    ${getImageUrl(imageUrl, IMAGE_SIZES.LARGE)} 480w,
    ${getImageUrl(imageUrl, IMAGE_SIZES.XL)} 556w,
    ${getImageUrl(imageUrl, IMAGE_SIZES.FULL)} 636w
  `.trim()
}

