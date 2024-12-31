"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formateProviderImage = exports.formatProductImageUrls = void 0;
const s3Upload_1 = require("./s3Upload");
const formatProductImageUrls = (product) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < product.images.length; i++) {
        product.images[i] = yield (0, s3Upload_1.getImageUrl)(product.images[i]);
    }
});
exports.formatProductImageUrls = formatProductImageUrls;
const formateProviderImage = (provider) => __awaiter(void 0, void 0, void 0, function* () {
    if (provider.profilePicturePath) {
        provider.profilePicturePath = yield (0, s3Upload_1.getImageUrl)(provider.profilePicturePath);
    }
});
exports.formateProviderImage = formateProviderImage;
