export type Message = {
    id: string,
    chatId: string,
    senderId: string,
    receiverId: string,
    content: string,
    timestamp?: string
}

export type LoginFormValue = {
    email: string,
    password: string
}

export type RegisterFormValue = {
    name: string,
    username: string,
    email: string,
    password: string
}

export type AuthResponse = {
    id: string,
    name: string,
    username: string,
    email: string,
    token: string,
    avatarUrl?: string,
    bio?: string
}

export type User = {
    id: string,
    name: string,
    username: string,
    email: string,
    avatarUrl?: string,
    bio?: string,
    online?: boolean,
    lastSeen?: string
}

export type Conversation = {
    odUserId: string,
    name: string,
    username: string,
    lastMessage: string | null,
    lastMessageTime: string | null,
    lastMessageSenderId: string | null,
    unreadCount: number,
    avatarUrl?: string
}

export type ProfileUpdateRequest = {
    name?: string,
    username?: string,
    email?: string,
    bio?: string
}

export type PasswordChangeRequest = {
    currentPassword: string,
    newPassword: string
}