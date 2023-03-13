export interface ReviewContentProps {
    timestamp: number,
    senderdiscordid: string,
    profile_photo: string,
    username: string;
    comment: string;
    badges: any[];
    isSystemMessage: boolean;
}