export function newChat(chatIndex) {
    return {
        name: `会话${chatIndex}`,
        createdAt: Date.now(),
        qaList: [],
        id: `${Date.now()}-${chatIndex}`
    }
}