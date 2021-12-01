import Main from './pages/Main';
import Profile from './pages/profile/Profile';
import Information from './pages/information/Information';

export const ROUTES = [
  {
    path: '/',
    component: Main,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/Information/:target',
    component: Information,
  },
];
