export function createPageUrl(page, language = 'pt') {
  const baseUrl = '/';
  const pageMap = {
    dashboard: 'dashboard',
    profile: 'profile',
    'data-sources': 'data-sources',
    'market-prices': 'market-prices',
    weather: 'weather',
    'learning-center': 'learning-center',
    marketplace: 'marketplace',
    community: 'community',
    consultations: 'consultations',
    checkout: 'checkout',
    'soil-analysis': 'soil-analysis'
  };
  
  return `${baseUrl}${pageMap[page] || page}`;
}
