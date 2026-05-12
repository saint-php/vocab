// Global store for the install prompt
let globalDeferredPrompt = null

export function setDeferredPrompt(prompt) {
  globalDeferredPrompt = prompt
}

export function getDeferredPrompt() {
  return globalDeferredPrompt
}

export function clearDeferredPrompt() {
  globalDeferredPrompt = null
}

export async function triggerInstall() {
  const prompt = getDeferredPrompt()
  
  if (!prompt) {
    return { success: false, error: 'No install prompt available' }
  }

  prompt.prompt()
  const { outcome } = await prompt.userChoice
  
  if (outcome === 'accepted') {
    clearDeferredPrompt()
    return { success: true }
  }
  
  return { success: false, error: 'User dismissed install' }
}