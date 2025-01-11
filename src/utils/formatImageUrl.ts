import { getImageUrl } from "./s3Upload"

export const formatProductImageUrls = async (product: { images: string[] }): Promise<void> => {
    const formattedImages = await Promise.all(
        product.images.map((image) => getImageUrl(image))
    );
    product.images = formattedImages;
}

export const formateProviderImage = async (provider: { profilePicturePath?: string }): Promise<void> => {
    if (provider.profilePicturePath) {
        provider.profilePicturePath = await getImageUrl(provider.profilePicturePath);
    }
}