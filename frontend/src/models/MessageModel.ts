export interface MessageResponse {
    id: number,
    title: string,
    question: string,
    adminName?: string,
    adminResponse?: string,
    closed?: boolean
}

export interface userCreateMessageRequest {
    title: string,
    question: string
}

export interface AdminMessageView {
    id: number,
    userEmail: string,
    title: string,
    question: string,
    createdAt: string,
}

export interface AdminReplyRequest {
    messageId: number,
    response: string
}