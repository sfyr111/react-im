export function getRedirectPath (params: { type: string, avatar: string}) {
  const { type, avatar } = params
  // 根据用户 返回跳转地址
  // user.type / boss / genius
  // user.avatar / bossinfo / geniusinfo
  let url = (type === 'boss') ? '/boss' : '/genius'
  if (!avatar) {
    url += 'info'
  }
  return url
}

export function getChatId (userId: string, targetId: string): string {
  return [userId, targetId].sort().join('_')
}
