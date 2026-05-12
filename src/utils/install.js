// Store the install prompt event
let deferredPrompt = null

export function initInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    console.log('Install prompt captured')
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    console.log('App was installed')
  })
}

export async function promptInstall() {
  if (!deferredPrompt) {
    return { success: false, error: 'no_prompt' }
  }

  deferredPrompt.prompt()
  
  const { outcome } = await deferredPrompt.userChoice
  
  if (outcome === 'accepted') {
    deferredPrompt = null
    return { success: true }
  }
  
  return { success: false, error: 'dismissed' }
}

export function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true
}