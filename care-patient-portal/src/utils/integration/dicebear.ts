const DICEBEAR_URL = "https://api.dicebear.com";
const FILE_TYPE = "svg";
const IMAGE_STYLE= "initials";
const RADIUS = 50;
const SIZE = 50;
const SCALE = 100;
const DICEBEAR_VERSION = "7.x"
import {z}from "zod";
const url =  z.string().url();
export const getDicebearProfileInititals= ( initials: string ) => {
    const imgUrl = `${DICEBEAR_URL}/${DICEBEAR_VERSION}/${IMAGE_STYLE}/${FILE_TYPE}?radius=${RADIUS}&size=${SIZE}&scale=${SCALE}&seed=${initials}`;
    try{
        url.parse(imgUrl);
        return imgUrl;
    } catch (e) {
        throw new Error("Invalid url, check dicebear url integration");
    }
}

export const getProfileInititals= ( initials: string ) => {
    const imgUrl = `${initials}`;
    try{
        // url.parse(imgUrl);
        return imgUrl;
    } catch (e) {
        throw new Error("Invalid url, check dicebear url integration");
    }
}