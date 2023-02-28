export interface ReviewContentProps {
    senderdiscordid: string,
    profile_photo: string,
    username: string;
    comment: string;
    [key: string]: string | number | undefined
}