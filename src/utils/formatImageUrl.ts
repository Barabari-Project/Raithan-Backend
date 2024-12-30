import { getImageUrl } from "./s3Upload"

export const formatProductImageUrls = async (product: { images: string[] }): Promise<void> => {
    for (let i = 0; i < product.images.length; i++) {
        product.images[i] = await getImageUrl(product.images[i]);
    }
}

export const formateProviderImage = async (provider: { profilePicturePath?: string }): Promise<void> => {
    if (provider.profilePicturePath) {
        provider.profilePicturePath = await getImageUrl(provider.profilePicturePath);
    }
}