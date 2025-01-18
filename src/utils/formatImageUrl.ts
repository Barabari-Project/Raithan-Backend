import { UploadedImages } from "../types/product.types";
import { getImageUrl } from "./s3Upload"

export const formatProductImageUrls = async (product: { images: UploadedImages }): Promise<void> => {
    const imageNames = Object.keys(product.images) as (keyof UploadedImages)[];

    // Filter and map the images to fetch URLs in parallel
    const formattedImages = await Promise.all(
        imageNames
            .filter(imageName => product.images[imageName])  // Filter only non-null images
            .map(imageName => getImageUrl(product.images[imageName]!))  // Fetch URL for each image
    );

    // Use reduce to rebuild the images object with formatted URLs
    product.images = imageNames.filter(imageName => product.images[imageName]).reduce((acc, key, index) => {
        acc[key] = formattedImages[index];  // Set the key with the corresponding URL
        return acc;
    }, {} as UploadedImages);
};


export const formateProviderImage = async (provider: { profilePicturePath?: string }): Promise<void> => {
    if (provider.profilePicturePath) {
        provider.profilePicturePath = await getImageUrl(provider.profilePicturePath);
    }
}