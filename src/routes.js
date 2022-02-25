import Main from './pages/Main';
import Profile from './pages/profile/Profile';
import Information from './pages/information/Information';
import ClassRegistration from './pages/ClassRegistration';

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
  {
    path: '/class',
    component: ClassRegistration,
  },
];
