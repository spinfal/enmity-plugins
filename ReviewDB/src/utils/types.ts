export interface ReviewContentProps {
    timestamp: number,
    senderdiscordid: string,
    profile_photo: string,
    username: string;
    comment: string;
    badges: Array<{ 
        badge_name: string;
        badge_icon: string;
    }> | [];
    isSystemMessage: boolean;
}