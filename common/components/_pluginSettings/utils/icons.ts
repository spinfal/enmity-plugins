import { getIDByName } from 'enmity/api/assets';

export const Icons = {
    Debug: getIDByName('debug'),
    Retry: getIDByName('ic_message_retry'),
    Failed: getIDByName('Small'),
    Cancel: getIDByName('ic_megaphone_nsfw_16px'),
    Delete: getIDByName('ic_message_delete'),

    Copy: getIDByName('toast_copy_link'),
    Open: getIDByName('ic_leave_stage'),
    Clipboard: getIDByName('pending-alert'),

    Debug_Command: {
        Sent: getIDByName('ic_application_command_24px'),
        Clock: getIDByName('clock')
    },

    Settings: {
        Toasts: {
            Context: getIDByName('toast_image_saved'),
            Settings: getIDByName('ic_selection_checked_24px')
        },
        Invite: getIDByName('invite'),
        Debug: getIDByName('ic_rulebook_16px'),
    }
};