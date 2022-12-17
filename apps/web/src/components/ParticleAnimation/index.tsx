import Particles from 'react-tsparticles'
import { loadFull } from 'tsparticles'
import option from './components/option'

const ParticleAnimation = () => {
  const particlesInit = async (main) => {
    await loadFull(main)
  }

  const particlesLoaded = (container) => {
    console.log(container)
  }
  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      // loaded={particlesLoaded}
      options={option.confetti}
    />
  )
}

export default ParticleAnimation
