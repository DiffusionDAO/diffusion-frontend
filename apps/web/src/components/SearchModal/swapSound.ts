let swapSound: HTMLAudioElement

const swapSoundURL = 'https://cdn.app.diffusiondao.org/swap.mp3'

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}
