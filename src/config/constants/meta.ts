import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'DiffusionDAO',
  description:
    'DiffusionDAO',
  image: '',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else if (path.startsWith('/teams')) {
    basePath = '/teams'
  } else if (path.startsWith('/voting/proposal') && path !== '/voting/proposal/create') {
    basePath = '/voting/proposal'
  } else if (path.startsWith('/nfts/collections')) {
    basePath = '/nfts/collections'
  } else if (path.startsWith('/nfts/profile')) {
    basePath = '/nfts/profile'
  } else if (path.startsWith('/pancake-squad')) {
    basePath = '/pancake-squad'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('Home')} | ${t('DiffusionDAO')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('DiffusionDAO')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('DiffusionDAO')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('DiffusionDAO')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('DiffusionDAO')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('DiffusionDAO')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('DiffusionDAO')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('DiffusionDAO')}`,
      }
    case '/prediction/leaderboard':
      return {
        title: `${t('Leaderboard')} | ${t('DiffusionDAO')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('DiffusionDAO')}`,
      }
    case '/farms/auction':
      return {
        title: `${t('Farm Auctions')} | ${t('DiffusionDAO')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('DiffusionDAO')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('DiffusionDAO')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('DiffusionDAO')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('DiffusionDAO')}`,
      }
    case '/voting':
      return {
        title: `${t('Voting')} | ${t('DiffusionDAO')}`,
      }
    case '/voting/proposal':
      return {
        title: `${t('Proposals')} | ${t('DiffusionDAO')}`,
      }
    case '/voting/proposal/create':
      return {
        title: `${t('Make a Proposal')} | ${t('DiffusionDAO')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('DiffusionDAO Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('DiffusionDAO Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('DiffusionDAO Info & Analytics')}`,
        description: 'View statistics for Pancakeswap exchanges.',
      }
    case '/nfts':
      return {
        title: `${t('Overview')} | ${t('DiffusionDAO')}`,
      }
    case '/nfts/collections':
      return {
        title: `${t('Collections')} | ${t('DiffusionDAO')}`,
      }
    case '/nfts/activity':
      return {
        title: `${t('Activity')} | ${t('DiffusionDAO')}`,
      }
    case '/nfts/profile':
      return {
        title: `${t('Profile')} | ${t('DiffusionDAO')}`,
      }
    case '/pancake-squad':
      return {
        title: `${t('Pancake Squad')} | ${t('DiffusionDAO')}`,
      }
    default:
      return null
  }
}
