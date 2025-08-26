export type Message = {
    id: string,
    chatId: string,
    senderId: string,
    receiverId: string,
    content: string
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
    token: string
}

export type User = {
    id: string,
    name: string,
    username: string,
    email: string
}